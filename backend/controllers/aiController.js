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
      You are an expert career counselor. Analyze the following resume text and suggest the top 3 best-fitting job roles for this person based on their skills and projects. 
      Also provide a brief reasoning for each role.

      Resume Text:
      ${resumeText}

      Format your response strictly as a JSON array where each object has:
      - role: The suggested job role (e.g., "Frontend Developer")
      - reasoning: A 1-2 sentence explanation of why this role fits based on their specific skills and projects.
      - matchScore: A percentage string (e.g., "95%") indicating how well their profile matches.

      Only return the JSON array without any extra text or markdown formatting.
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
    const suggestions = JSON.parse(jsonStr);

    res.status(200).json({ success: true, suggestions });
  } catch (err) {
    console.error("Resume analysis error:", err.message);
    res.status(500).json({ success: false, message: `AI Error: ${err.message}` });
  }
};
