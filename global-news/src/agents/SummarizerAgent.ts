import { BaseAgent, GoogleAIService } from './BaseAgent';
import { NewsPost } from './types';

export class SummarizerAgent extends BaseAgent {
  private googleAI: GoogleAIService;

  constructor() {
    super('Summarizer Agent');
    this.googleAI = new GoogleAIService();
  }

  async process(newsPost: NewsPost): Promise<NewsPost> {
    this.log(`Summarizing article: ${newsPost.title}`);
    
    try {
      const summary = await this.generateSummary(newsPost);
      
      const processedPost: NewsPost = {
        ...newsPost,
        summary,
        agentProcessed: {
          summarized: true,
          factChecked: newsPost.agentProcessed?.factChecked || false,
          processedAt: new Date().toISOString()
        }
      };

      this.updateMetrics(true);
      this.log(`Successfully summarized: ${newsPost.title}`);
      
      return processedPost;
    } catch (error) {
      this.log('Error summarizing article:', error);
      this.updateMetrics(false);
      return newsPost;
    }
  }

  private async generateSummary(newsPost: NewsPost): Promise<string> {
    const prompt = `
    Please summarize the following news article in 2-3 sentences, focusing on the key facts and impact:
    
    Title: ${newsPost.title}
    Content: ${newsPost.content}
    Source: ${newsPost.source}
    Location: ${newsPost.location.city}, ${newsPost.location.country}
    
    Provide a clear, concise summary that captures the main points and relevance to local readers.
    `;

    try {
      const summary = await this.googleAI.generateText(prompt);
      return summary.trim();
    } catch (_error) {
      // Fallback summary logic
      return this.createFallbackSummary(newsPost);
    }
  }

  private createFallbackSummary(newsPost: NewsPost): string {
    // Simple extractive summary as fallback
    const sentences = newsPost.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) {
      return newsPost.content;
    }
    
    // Take first two sentences as summary
    return sentences.slice(0, 2).join('. ').trim() + '.';
  }

  async processBatch(newsPosts: NewsPost[]): Promise<NewsPost[]> {
    this.log(`Processing batch of ${newsPosts.length} articles for summarization`);
    
    const processedPosts = await Promise.all(
      newsPosts.map(post => this.process(post))
    );

    this.log(`Completed batch processing: ${processedPosts.length} articles summarized`);
    return processedPosts;
  }

  // Method to get summarization quality metrics
  getSummarizationMetrics() {
    return {
      ...this.getMetrics(),
      avgSummaryLength: 150, // mock metric
      summaryQualityScore: 0.85 // mock metric
    };
  }
}