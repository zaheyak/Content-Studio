// ✅ GeminiService.js — Updated for API v1 (works with gemini-pro, flash, and pro-latest)
const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = "models/gemini-1.5-flash"; // ✅ שימי לב ל־"models/"

    if (!this.apiKey) {
      console.warn("⚠️ GEMINI_API_KEY not set — AI features disabled.");
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async generateText(prompt) {
    if (!this.genAI) {
      return "AI service not configured. Please set GEMINI_API_KEY.";
    }

    try {
      // ✅ תיקון: שימוש במבנה הנתיב החדש לפי v1
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("❌ Gemini API Error:", error);
      throw new Error(`Failed to generate text with Gemini: ${error.message}`);
    }
  }

  async generateLessonContent(transcript) {
    const prompt = `
    Create educational lesson content based on this transcript:

    Transcript: ${transcript}

    Please generate:
    1. Lesson title
    2. Description
    3. Learning objectives
    4. Main content
    5. Examples
    6. Summary
    `;
    return await this.generateText(prompt);
  }

  async generateMindMap(lessonContent) {
    const prompt = `
    Create a mind map for this content:

    ${lessonContent}

    Return JSON format only:
    { "root": "Main Topic", "branches": [...] }
    `;
    const result = await this.generateText(prompt);

    try {
      return JSON.parse(result);
    } catch {
      return { root: "Main Topic", branches: [] };
    }
  }

  async translateContent(content, targetLanguage) {
    const prompt = `
    Translate to ${targetLanguage}:
    ${content}
    `;
    return await this.generateText(prompt);
  }

  async qualityCheck(content) {
    const prompt = `
    Analyze this educational content:
    ${content}
    Provide feedback on clarity, completeness, and improvements.
    `;
    return await this.generateText(prompt);
  }
}

module.exports = new GeminiService();
