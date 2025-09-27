import { BaseAgent, GoogleAIService } from './BaseAgent';
import { NewsPost } from './types';

export class FactCheckAgent extends BaseAgent {
  private googleAI: GoogleAIService;

  constructor() {
    super('Fact-Check Agent');
    this.googleAI = new GoogleAIService();
  }

  async process(newsPost: NewsPost): Promise<NewsPost> {
    this.log(`Fact-checking article: ${newsPost.title}`);
    
    try {
      const factCheckResult = await this.performFactCheck(newsPost);
      
      const processedPost: NewsPost = {
        ...newsPost,
        credibilityScore: factCheckResult.credibilityScore,
        factCheckStatus: factCheckResult.status,
        factCheckReport: factCheckResult.report,
        agentProcessed: {
          summarized: newsPost.agentProcessed?.summarized || false,
          factChecked: true,
          processedAt: new Date().toISOString()
        }
      };

      this.updateMetrics(true);
      this.log(`Fact-check completed for: ${newsPost.title} (Score: ${factCheckResult.credibilityScore})`);
      
      return processedPost;
    } catch (error) {
      this.log('Error fact-checking article:', error);
      this.updateMetrics(false);
      return newsPost;
    }
  }

  private async performFactCheck(newsPost: NewsPost): Promise<{
    credibilityScore: number;
    status: 'verified' | 'disputed' | 'pending' | 'unverified';
    report: string;
  }> {
    // Combine multiple fact-checking methods
    const sourceCredibility = this.assessSourceCredibility(newsPost.source);
    const contentAnalysis = await this.analyzeContent(newsPost);
    const crossReference = await this.crossReferenceWithSources(newsPost);

    const credibilityScore = this.calculateOverallScore(sourceCredibility, contentAnalysis, crossReference);
    const status = this.determineStatus(credibilityScore);
    const report = await this.generateFactCheckReport(newsPost, credibilityScore, {
      sourceCredibility,
      contentAnalysis,
      crossReference
    });

    return {
      credibilityScore,
      status,
      report
    };
  }

  private assessSourceCredibility(source: string): number {
    // Mock source credibility database
    const sourceCredibilityDB: Record<string, number> = {
      'Local News Network': 85,
      'Weather Service': 95,
      'Business Journal': 80,
      'Community Tribune': 75,
      'City Herald': 82
    };

    return sourceCredibilityDB[source] || 60; // Default score for unknown sources
  }

  private async analyzeContent(newsPost: NewsPost): Promise<number> {
    const prompt = `
    Analyze the following news content for factual accuracy indicators:
    
    Title: ${newsPost.title}
    Content: ${newsPost.content}
    
    Rate the content from 0-100 based on:
    1. Presence of specific facts and data
    2. Use of quotes and citations
    3. Objective tone vs. sensational language
    4. Logical consistency
    
    Return only a numerical score.
    `;

    try {
      const response = await this.googleAI.generateText(prompt);
      const score = parseInt(response.match(/\d+/)?.[0] || '70');
      return Math.min(Math.max(score, 0), 100);
    } catch (_error) {
      // Fallback content analysis
      return this.basicContentAnalysis(newsPost);
    }
  }

  private basicContentAnalysis(newsPost: NewsPost): number {
    let score = 70; // Base score
    
    // Check for factual indicators
    if (newsPost.content.includes('according to') || newsPost.content.includes('reported')) score += 10;
    if (newsPost.content.includes('"') && newsPost.content.split('"').length > 2) score += 5; // Has quotes
    if (newsPost.content.length > 200) score += 5; // Detailed content
    if (newsPost.tags && newsPost.tags.length > 0) score += 5; // Categorized content
    
    return Math.min(score, 100);
  }

  private async crossReferenceWithSources(newsPost: NewsPost): Promise<number> {
    // In a real implementation, this would check against multiple news APIs
    // For demo, simulate cross-referencing
    this.log(`Cross-referencing: ${newsPost.title}`);
    
    // Mock cross-reference results
    const mockResults = [
      { source: 'Google News', found: Math.random() > 0.3 },
      { source: 'Reuters', found: Math.random() > 0.5 },
      { source: 'AP News', found: Math.random() > 0.4 }
    ];

    const foundCount = mockResults.filter(r => r.found).length;
    const crossRefScore = (foundCount / mockResults.length) * 100;
    
    this.log(`Cross-reference results: ${foundCount}/${mockResults.length} sources confirmed`);
    return crossRefScore;
  }

  private calculateOverallScore(sourceScore: number, contentScore: number, crossRefScore: number): number {
    // Weighted average
    const weights = {
      source: 0.3,
      content: 0.4,
      crossRef: 0.3
    };

    const overallScore = 
      (sourceScore * weights.source) +
      (contentScore * weights.content) +
      (crossRefScore * weights.crossRef);

    return Math.round(overallScore);
  }

  private determineStatus(score: number): 'verified' | 'disputed' | 'pending' | 'unverified' {
    if (score >= 80) return 'verified';
    if (score >= 60) return 'unverified';
    if (score >= 40) return 'pending';
    return 'disputed';
  }

  private async generateFactCheckReport(
    newsPost: NewsPost, 
    score: number, 
    details: {
      sourceCredibility: number;
      contentAnalysis: number;
      crossReference: number;
    }
  ): Promise<string> {
    const prompt = `
    Generate a concise fact-check report for this news article:
    
    Title: ${newsPost.title}
    Overall Credibility Score: ${score}/100
    
    Report should include:
    1. Key credibility factors
    2. Any concerns or limitations
    3. Recommendation for readers
    
    Keep it under 3 sentences and professional.
    `;

    try {
      const report = await this.googleAI.generateText(prompt);
      return report.trim();
    } catch (_error) {
      return this.generateFallbackReport(score, details);
    }
  }

  private generateFallbackReport(score: number, _details: unknown): string {
    if (score >= 80) {
      return `This article has been verified with high confidence (${score}/100). Source credibility and content analysis support the reported facts.`;
    } else if (score >= 60) {
      return `This article appears credible but requires additional verification (${score}/100). Cross-reference with multiple sources recommended.`;
    } else {
      return `This article has credibility concerns (${score}/100). Information should be verified through additional reliable sources before sharing.`;
    }
  }

  async processBatch(newsPosts: NewsPost[]): Promise<NewsPost[]> {
    this.log(`Processing batch of ${newsPosts.length} articles for fact-checking`);
    
    const processedPosts = await Promise.all(
      newsPosts.map(post => this.process(post))
    );

    this.log(`Completed batch fact-checking: ${processedPosts.length} articles processed`);
    return processedPosts;
  }

  getFactCheckMetrics() {
    return {
      ...this.getMetrics(),
      avgCredibilityScore: 76, // mock metric
      verifiedArticles: Math.floor(this.tasksCompleted * 0.7), // mock metric
      disputedArticles: Math.floor(this.tasksCompleted * 0.1) // mock metric
    };
  }
}