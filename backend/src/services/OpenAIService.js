// ✅ OpenAIService.js — OpenAI API integration for Content Studio
const OpenAI = require('openai');

class OpenAIService {
  constructor() {
    // Try multiple possible environment variable names
    this.apiKey = process.env.OPENAI_API_KEY || 
                  process.env.openai_api_key || 
                  process.env.OPENAIKEY ||
                  process.env.openai_key;
    
    console.log('🔍 Checking for OpenAI API key...');
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
    console.log('openai_api_key exists:', !!process.env.openai_api_key);
    console.log('OPENAIKEY exists:', !!process.env.OPENAIKEY);
    console.log('openai_key exists:', !!process.env.openai_key);
    console.log('Final API key found:', !!this.apiKey);
    
    if (!this.apiKey) {
      console.warn('❌ No OpenAI API key found in environment variables - AI features will be disabled');
      console.warn('Available env vars:', Object.keys(process.env).filter(key => key.toLowerCase().includes('openai')));
      this.client = null;
    } else {
      this.client = new OpenAI({ 
        apiKey: this.apiKey 
      });
      console.log('✅ OpenAI connected');
      console.log('🤖 Model: gpt-4o-mini');
      console.log('📦 API version: v1');
    }
  }

  async generateText(prompt) {
    if (!this.client) {
      return "AI service not configured. Missing OPENAI_API_KEY.";
    }

    try {
      console.log(`🔄 Generating text with OpenAI...`);
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      });
      
      const result = response.choices[0].message.content;
      console.log(`✅ OpenAI generation successful`);
      return result;
    } catch (error) {
      console.error("❌ OpenAI API Error:", error);
      throw new Error(`Failed to generate text with OpenAI: ${error.message}`);
    }
  }

  async generateLessonContent(transcript) {
    const prompt = `
    Create educational lesson content based on this transcript:
    
    ${transcript}
    
    Please provide:
    1. A clear lesson title
    2. Key learning objectives
    3. Main concepts explained
    4. Examples and practical applications
    5. Summary and key takeaways
    
    Format the content in a structured, educational manner suitable for students.
    `;

    return await this.generateText(prompt);
  }

  async generateQuiz(lessonContent) {
    const prompt = `
    Based on this lesson content, create a quiz with 5 multiple choice questions:
    
    ${lessonContent}
    
    For each question, provide:
    - The question
    - 4 answer options (A, B, C, D)
    - The correct answer
    - A brief explanation
    
    Format as JSON with questions array.
    `;

    return await this.generateText(prompt);
  }

  async generateSummary(text) {
    const prompt = `
    Please provide a concise summary of the following text:
    
    ${text}
    
    Include:
    - Main points
    - Key concepts
    - Important details
    
    Keep it clear and educational.
    `;

    return await this.generateText(prompt);
  }
}

module.exports = new OpenAIService();
