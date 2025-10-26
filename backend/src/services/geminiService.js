const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY; // מגיע מ־Railway
    this.model = 'gemini-pro';

    
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment variables - AI features will be disabled');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  async generateText(prompt) {
    try {
      if (!this.apiKey || !this.genAI) {
        return 'AI service is not configured. Please set GEMINI_API_KEY environment variable.';
      }
      
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      throw new Error(`Failed to generate text with Gemini: ${error.message}`);
    }
  }

  async generateLessonContent(transcript, options = {}) {
    const prompt = `
    Create educational lesson content based on this transcript:
    
    Transcript: ${transcript}
    
    Please generate:
    1. A clear lesson title
    2. A comprehensive lesson description
    3. Key learning objectives
    4. Main content points
    5. Examples and explanations
    6. Summary of key takeaways
    
    Format the response as structured educational content suitable for students.
    `;

    return await this.generateText(prompt);
  }

  async generateMindMap(lessonContent) {
    const prompt = `
    Create a mind map structure for this lesson content:
    
    ${lessonContent}
    
    Generate a JSON structure with:
    - Main topic as root node
    - Subtopics as branches
    - Key points as leaf nodes
    - Connections between related concepts
    
    Return only valid JSON format.
    `;

    const result = await this.generateText(prompt);
    try {
      return JSON.parse(result);
    } catch (error) {
      // If JSON parsing fails, return a structured object
      return {
        root: "Main Topic",
        branches: [
          { topic: "Key Point 1", details: ["Detail 1", "Detail 2"] },
          { topic: "Key Point 2", details: ["Detail 3", "Detail 4"] }
        ]
      };
    }
  }

  async translateContent(content, targetLanguage) {
    const prompt = `
    Translate the following content to ${targetLanguage}:
    
    ${content}
    
    Provide a natural, accurate translation that maintains the original meaning and educational value.
    `;

    return await this.generateText(prompt);
  }

  async qualityCheck(content) {
    const prompt = `
    Analyze this educational content for quality and provide feedback:
    
    ${content}
    
    Evaluate:
    1. Clarity and readability
    2. Educational value
    3. Structure and organization
    4. Completeness
    5. Areas for improvement
    
    Provide specific, actionable recommendations.
    `;

    return await this.generateText(prompt);
  }
}

module.exports = new GeminiService();