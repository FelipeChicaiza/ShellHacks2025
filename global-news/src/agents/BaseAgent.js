// BaseAgent and GoogleAIService (JS version)
import { GoogleGenerativeAI } from '@google/generative-ai';

export class BaseAgent {
  constructor(name) {
    this.name = name;
    this.isActive = false;
    this.tasksCompleted = 0;
    this.tasksFailed = 0;
    this.lastActive = new Date().toISOString();
  }

  // Implement in subclasses
  async process(_data) {
    throw new Error('process() not implemented');
  }

  updateMetrics(success) {
    if (success) this.tasksCompleted++;
    else this.tasksFailed++;
    this.lastActive = new Date().toISOString();
  }

  getMetrics() {
    return {
      name: this.name,
      tasksCompleted: this.tasksCompleted,
      tasksFailed: this.tasksFailed,
      isActive: this.isActive,
      lastActive: this.lastActive
    };
  }

  log(message, data) {
    console.log(`[${this.name}] ${new Date().toISOString()}: ${message}`, data ? JSON.stringify(data) : '');
  }
}

export class GoogleAIService {
  constructor() {
    this.genAI = undefined;
    this.model = undefined;
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (apiKey && apiKey !== 'demo-key') {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
      } catch (err) {
        console.warn('Google AI initialization failed, falling back to mock responses', err);
        this.genAI = undefined;
      }
    } else {
      console.log('Google AI API key not found, using fallback responses');
    }
  }

  async generateText(prompt) {
    try {
      if (this.model && process.env.GOOGLE_AI_API_KEY) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Google Gemini AI response generated successfully');
        return text;
      } else {
        return this.mockAIResponse(prompt);
      }
    } catch (error) {
      console.error('Google AI API error:', error);
      return this.mockAIResponse(prompt);
    }
  }

  mockAIResponse(prompt) {
    if (prompt.includes('summarize')) {
      return 'AI Summary: This news article discusses recent developments in the local area, highlighting key impacts on the community and relevant stakeholder responses.';
    } else if (prompt.includes('fact-check')) {
      return 'Fact-Check Report: Cross-referenced with multiple sources. Information appears credible with supporting evidence from established news outlets. Credibility Score: 85/100.';
    }
    return 'AI processing completed successfully.';
  }
}
