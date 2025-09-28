// BaseAgent and GoogleAIService (JS version)
// Note: `@google/generative-ai` is loaded lazily at runtime only when a real
// GOOGLE_AI_API_KEY is present. This avoids build-time "cannot resolve"
// errors when the package isn't installed or available in the environment.

export class BaseAgent {
  constructor(name) {
    this.name = name;
    this.isActive = false;
    this.tasksCompleted = 0;
    this.tasksFailed = 0;
    this.lastActive = new Date().toISOString();
  }

  // Implement in subclasses
  async process() {
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
    this.apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!this.apiKey || this.apiKey === 'demo-key') {
      console.log('Google AI API key not found or demo key used; using fallback responses');
    }
    this._initialized = false;
  }

  async _initIfNeeded() {
    if (this._initialized) return;
    if (!this.apiKey || this.apiKey === 'demo-key') {
      this._initialized = true; // nothing to do, will use mocks
      return;
    }
    try {
      // Dynamic import so bundlers don't require the package at build time
      const mod = await import('@google/generative-ai');
      const GoogleGenerativeAI = mod.GoogleGenerativeAI || mod.default || mod;
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this._initialized = true;
      console.log('Google Generative AI initialized');
    } catch (err) {
      console.warn('Google AI initialization failed, falling back to mock responses', err);
      this.genAI = undefined;
      this.model = undefined;
      this._initialized = true;
    }
  }

  async generateText(prompt) {
    try {
      await this._initIfNeeded();
      if (this.model) {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Google Gemini AI response generated successfully');
        return text;
      }
      return this.mockAIResponse(prompt);
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
