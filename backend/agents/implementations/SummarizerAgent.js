import { summarizeText } from '../clients/gemini.client.js';

export default class SummarizerAgent {
  constructor() {
    this.tasksCompleted = 0;
    this.tasksFailed = 0;
    this.lastActive = null;
  }

  async processBatch(articles) {
    this.lastActive = new Date().toISOString();
    const out = [];
    for (const a of articles) {
      try {
        const text = (a.description || a.summary || a.content || a.title || '').slice(0, 4000);
        const summary = await summarizeText(text, { maxTokens: 150 });
        this.tasksCompleted += 1;
        out.push({ ...a, summary });
      } catch (err) {
        this.tasksFailed += 1;
        console.error('SummarizerAgent error', err);
        out.push({ ...a, summary: (a.summary || '').slice(0, 200) });
      }
    }
    return out;
  }

  getSummarizationMetrics() {
    return { tasksCompleted: this.tasksCompleted, tasksFailed: this.tasksFailed, lastActive: this.lastActive };
  }
}
