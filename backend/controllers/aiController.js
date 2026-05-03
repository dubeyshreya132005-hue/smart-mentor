const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");

// Helper to get Gemini AI instance
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in environment variables.");
  }
  return new GoogleGenerativeAI(apiKey);
};

// POST /api/ai/roadmap
exports.generateRoadmap = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting from AI response
    const jsonStr = text.replace(/```json|```/g, "").trim();
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

    const genAI = getGenAI();
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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt 
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 800,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    res.status(200).json({ success: true, reply: response.text() });
  } catch (err) {
    console.error("AI Chat error:", err.message);
    res.status(500).json({ success: false, message: `AI Assistant error: ${err.message}` });
  }
};
