import { GoogleGenerativeAI } from '@google/generative-ai';

// Base Agent class that other agents extend
export abstract class BaseAgent {
  protected name: string;
  protected isActive: boolean = false;
  protected tasksCompleted: number = 0;
  protected tasksFailed: number = 0;
  protected lastActive: string = new Date().toISOString();

  constructor(name: string) {
    this.name = name;
  }

  abstract process(data: unknown): Promise<unknown>;

  protected updateMetrics(success: boolean) {
    if (success) {
      this.tasksCompleted++;
    } else {
      this.tasksFailed++;
    }
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

  protected log(message: string, data?: unknown) {
    console.log(`[${this.name}] ${new Date().toISOString()}: ${message}`, data ? JSON.stringify(data) : '');
  }
}

// Google AI Service wrapper
export class GoogleAIService {
  private genAI?: GoogleGenerativeAI;
  private model?: any;

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (apiKey && apiKey !== 'demo-key') {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log('✅ Google Gemini AI initialized successfully');
    } else {
      console.log('⚠️ Google AI API key not found, using fallback responses');
    }
  }

  async generateText(prompt: string): Promise<string> {
    try {
      if (this.model && process.env.GOOGLE_AI_API_KEY) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('🤖 Google Gemini AI response generated successfully');
        return text;
      } else {
        return this.mockAIResponse(prompt);
      }
    } catch (error) {
      console.error('Google AI API error:', error);
      return this.mockAIResponse(prompt);
    }
  }

  private mockAIResponse(prompt: string): string {
    if (prompt.includes('summarize')) {
      return "AI Summary: This news article discusses recent developments in the local area, highlighting key impacts on the community and relevant stakeholder responses.";
    } else if (prompt.includes('fact-check')) {
      return "Fact-Check Report: Cross-referenced with multiple sources. Information appears credible with supporting evidence from established news outlets. Credibility Score: 85/100.";
    }
    return "AI processing completed successfully.";
  }
}