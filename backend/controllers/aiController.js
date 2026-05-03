const User = require("../models/User");
const pdf = require('pdf-parse');
const { OpenRouter } = require("@openrouter/sdk");

// Helper to get OpenRouter instance
const getOpenRouter = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing in environment variables.");
  }
  return new OpenRouter({ apiKey });
};

// POST /api/ai/roadmap
exports.generateRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const openrouter = getOpenRouter();

    const prompt = `
      As an expert career mentor, generate a structured career roadmap for a student with the following profile:
      - Name: ${user.name}
      - Current Skills: ${user.skills.join(", ") || "None"}
      - Target Role: ${user.targetRole || "Full Stack Developer"}
      - Interests: ${user.interests.join(", ") || "General"}

      The roadmap should be a JSON array of milestones. Each milestone should have:
      - title: A short descriptive title
      - description: What needs to be learned
      - status: Either "completed" (if they already have the skill) or "pending"
      - resources: A few suggested topics or technologies to focus on

      Format the response ONLY as a JSON array.
    `;

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "tencent/hy3-preview:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true
      }
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
      }
    }
    
    // Clean up potential markdown formatting from AI response
    const jsonStr = fullResponse.replace(/```json|```/g, "").trim();
    const roadmap = JSON.parse(jsonStr);

    res.status(200).json({ success: true, roadmap });
  } catch (err) {
    console.error("Roadmap generation error:", err.message);
    res.status(500).json({ success: false, message: `AI Error: ${err.message}` });
  }
};

// POST /api/ai/chat
exports.chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;
    const user = await User.findById(req.user.id);

    const openrouter = getOpenRouter();
    const systemPrompt = `You are "MentorConnect AI", an elite, friendly, and highly technical career mentor.
    You are directly mentoring ${user?.name || "a student"}.
    - Their current skills: ${user?.skills?.join(', ') || 'None listed'}.
    - Their target role: ${user?.targetRole || 'Full Stack Developer'}.
    - Their preferred learning style: ${user?.learningStyle || 'friendly'}.
    
    CRITICAL GUIDELINES:
    1. Provide extremely concise, actionable, and specific advice.
    2. Use markdown formatting (code blocks, bold text, bullet points) heavily for readability.
    3. Keep responses under 3 paragraphs unless they explicitly ask for a detailed tutorial or code.
    4. Be highly encouraging but technically rigorous.
    5. Always tailor your advice specifically to their target role and current skills.`;

    // Convert history format if necessary (Assuming history is an array of {role, parts: [{text}]} from Gemini)
    // Map to OpenRouter format: {role, content}
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts ? msg.parts[0].text : msg.content
    }));

    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
      { role: 'user', content: message }
    ];

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "tencent/hy3-preview:free",
        messages: messages,
        stream: true
      }
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
      }
    }
    
    res.status(200).json({ success: true, reply: fullResponse });
  } catch (err) {
    console.error("AI Chat error:", err.message);
    res.status(500).json({ success: false, message: `AI Assistant error: ${err.message}` });
  }
};

// POST /api/ai/analyze-resume
exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No resume file provided." });
    }

    const data = await pdf(req.file.buffer);
    const resumeText = data.text;

    const openrouter = getOpenRouter();

    const prompt = `
      You are an expert career counselor and ATS (Applicant Tracking System) simulator. Analyze the following resume text.
      Provide the following:
      1. An overall ATS Score (0-100) based on readability, keyword optimization, and structure.
      2. 3-4 Strong Points of the resume.
      3. 3-4 Weak Points or areas for improvement.
      4. Top 3 best-fitting job roles based on their skills and projects.

      Resume Text:
      ${resumeText}

      Format your response strictly as a JSON object with the following structure:
      {
        "atsScore": 85,
        "strongPoints": ["Good use of action verbs", "Clear project descriptions"],
        "weakPoints": ["Missing metrics in experience", "Formatting could be cleaner"],
        "suggestions": [
          {
            "role": "Frontend Developer",
            "reasoning": "Strong React skills and relevant UI projects.",
            "matchScore": "95%"
          }
        ]
      }

      Only return the JSON object without any extra text or markdown formatting.
    `;

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "tencent/hy3-preview:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true
      }
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
      }
    }
    
    const jsonStr = fullResponse.replace(/```json|```/g, "").trim();
    const resultJson = JSON.parse(jsonStr);

    res.status(200).json({ success: true, analysis: resultJson });
  } catch (err) {
    console.error("Resume analysis error:", err.message);
    res.status(500).json({ success: false, message: `AI Error: ${err.message}` });
  }
};

// ── RAG Helpers ─────────────────────────────────────────────────────────────

// Chunk a string into overlapping word windows
function chunkText(text, size = 300, overlap = 50) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += size - overlap) {
    const slice = words.slice(i, i + size).join(' ');
    if (slice.trim()) chunks.push(slice);
  }
  return chunks;
}

// Jaccard-style keyword overlap — FIXED: use .length on array, not .size
function keywordOverlap(source, target) {
  const tokenize = (t) =>
    new Set(
      t.toLowerCase()
       .replace(/[^a-z0-9\s#.+]/g, ' ')
       .split(/\s+/)
       .filter(w => w.length > 2)
    );
  const srcSet = tokenize(source);
  const tgtSet = tokenize(target);
  // intersection is an Array → use .length (not .size)
  const intersection = [...srcSet].filter(w => tgtSet.has(w));
  const unionSize = srcSet.size + tgtSet.size - intersection.length;
  return {
    score: unionSize > 0 ? Math.round((intersection.length / unionSize) * 100) : 0,
    matched: intersection.slice(0, 20)
  };
}

// Retrieve topK chunks most relevant to the JD
function retrieveRelevantChunks(resumeChunks, jdText, topK = 3) {
  return resumeChunks
    .map(chunk => ({ chunk, score: keywordOverlap(chunk, jdText).score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(c => c.chunk);
}

// Truncate a string to maxWords to keep prompts within token limits
function truncateWords(text, maxWords = 250) {
  const words = text.split(/\s+/);
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '…' : text;
}

// POST /api/ai/compare-resumes  ── RAG-powered multi-resume JD comparison
exports.compareResumes = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No resume files uploaded." });
    }

    const jobDescription = req.body.jobDescription;
    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({ success: false, message: "Please provide a detailed job description (at least 30 chars)." });
    }

    const openrouter = getOpenRouter();

    // ── Step 1: Extract text from each PDF
    const resumeTexts = await Promise.all(
      req.files.map(async (file) => {
        const parsed = await pdf(file.buffer);
        return { name: file.originalname, text: parsed.text.replace(/\s+/g, ' ').trim() };
      })
    );

    // ── Step 2: RAG — chunk each resume, retrieve relevant passages, compute keyword stats
    const retrievedContexts = resumeTexts.map(({ name, text }) => {
      const chunks = chunkText(text, 300, 50);
      const relevantChunks = retrieveRelevantChunks(chunks, jobDescription, 3);
      const { score: rawOverlap, matched: matchedKeywords } = keywordOverlap(text, jobDescription);
      return { name, relevantChunks, rawOverlap, matchedKeywords };
    });

    // ── Step 3: Truncate JD to 400 words to avoid token limits on free models
    const jdTruncated = truncateWords(jobDescription, 400);

    // ── Step 4: Build compact RAG prompt
    const resumeSections = retrievedContexts.map(({ name, relevantChunks, rawOverlap, matchedKeywords }, idx) =>
      `--- RESUME ${idx + 1}: "${name}" ---
Keyword Match: ${rawOverlap}% | Matched: ${matchedKeywords.slice(0, 10).join(', ')}
Top Passages:
${relevantChunks.map((c, i) => `[${i + 1}] ${truncateWords(c, 200)}`).join('\n')}`
    ).join('\n\n');

    const prompt = `You are an expert ATS evaluator. Analyze each resume STRICTLY against this job description using RAG.

JOB DESCRIPTION:
${jdTruncated}

${resumeSections}

For EACH resume return a JSON object with:
- resumeName: exact filename
- atsScore: 0-100 (how well it matches THIS specific JD)
- strongPoints: array of 3 strengths aligned with JD
- weakPoints: array of 2-3 gaps vs JD requirements
- missingKeywords: array of important JD skills missing from resume
- fitSummary: 1 sentence verdict

Return ONLY a valid JSON array. No markdown. No extra text.
[{"resumeName":"...","atsScore":0,"strongPoints":[],"weakPoints":[],"missingKeywords":[],"fitSummary":"..."}]`;

    // ── Step 5: Use NON-STREAMING to avoid stream termination on large prompts
    let fullResponse = "";
    try {
      const response = await openrouter.chat.send({
        chatRequest: {
          model: "tencent/hy3-preview:free",
          messages: [{ role: "user", content: prompt }],
          stream: false
        }
      });
      fullResponse = response?.choices?.[0]?.message?.content || "";
    } catch (streamErr) {
      // Fallback: try streaming if non-streaming fails
      console.warn("Non-streaming failed, trying streaming fallback:", streamErr.message);
      const stream = await openrouter.chat.send({
        chatRequest: {
          model: "tencent/hy3-preview:free",
          messages: [{ role: "user", content: prompt }],
          stream: true
        }
      });
      for await (const chunk of stream) {
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) fullResponse += content;
      }
    }

    if (!fullResponse || fullResponse.trim().length === 0) {
      throw new Error("Empty response from AI model. Please try again.");
    }

    // ── Step 6: Parse JSON — find the array even if there's surrounding text
    let jsonStr = fullResponse.replace(/```json|```/g, "").trim();
    const arrayStart = jsonStr.indexOf('[');
    const arrayEnd = jsonStr.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1) {
      jsonStr = jsonStr.slice(arrayStart, arrayEnd + 1);
    }

    let results;
    try {
      results = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error("JSON parse error. Raw response:", fullResponse.slice(0, 500));
      throw new Error("AI returned an invalid format. Please try again with shorter resumes.");
    }

    // ── Step 7: Enrich with pre-computed stats and sort best → worst
    const enriched = results.map((r, idx) => ({
      ...r,
      matchedKeywords: retrievedContexts[idx]?.matchedKeywords || [],
      rawOverlapScore: retrievedContexts[idx]?.rawOverlap || 0,
    }));
    enriched.sort((a, b) => b.atsScore - a.atsScore);

    res.status(200).json({ success: true, results: enriched, totalResumes: enriched.length });
  } catch (err) {
    console.error("Compare resumes error:", err.message);
    res.status(500).json({ success: false, message: `Analysis failed: ${err.message}` });
  }
};
