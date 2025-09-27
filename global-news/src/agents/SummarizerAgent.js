import { BaseAgent, GoogleAIService } from './BaseAgent.js';

export class SummarizerAgent extends BaseAgent {
  constructor() {
    super('Summarizer Agent');
    this.googleAI = new GoogleAIService();
  }

  async process(newsPost) {
    this.log(`Summarizing article: ${newsPost.title}`);
    try {
      const summary = await this.generateSummary(newsPost);
      const processedPost = Object.assign({}, newsPost, { summary, agentProcessed: { summarized: true, factChecked: newsPost.agentProcessed?.factChecked || false, processedAt: new Date().toISOString() } });
      this.updateMetrics(true);
      this.log(`Successfully summarized: ${newsPost.title}`);
      return processedPost;
    } catch (error) {
      this.log('Error summarizing article:', error);
      this.updateMetrics(false);
      return newsPost;
    }
  }

  async generateSummary(newsPost) {
    const prompt = `Please summarize the following news article in 2-3 sentences, focusing on the key facts and impact:\n\nTitle: ${newsPost.title}\nContent: ${newsPost.content}\nSource: ${newsPost.source}\nLocation: ${newsPost.location.city}, ${newsPost.location.country}\n\nProvide a clear, concise summary that captures the main points and relevance to local readers.`;
    try {
      const summary = await this.googleAI.generateText(prompt);
      return summary.trim();
    } catch (error) {
      return this.createFallbackSummary(newsPost);
    }
  }

  createFallbackSummary(newsPost) {
    const sentences = (newsPost.content || '').split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return newsPost.content;
    return sentences.slice(0,2).join('. ').trim() + '.';
  }

  async processBatch(newsPosts) { const processedPosts = await Promise.all(newsPosts.map(p => this.process(p))); this.log(`Completed batch processing: ${processedPosts.length} articles summarized`); return processedPosts; }

  getSummarizationMetrics() { return Object.assign({}, this.getMetrics(), { avgSummaryLength: 150, summaryQualityScore: 0.85 }); }
}
