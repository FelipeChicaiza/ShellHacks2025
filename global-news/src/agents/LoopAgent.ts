import { BaseAgent, GoogleAIService } from './BaseAgent';
import { NewsPost } from './types';

export class LoopAgent extends BaseAgent {
  private googleAI: GoogleAIService;
  private isRunning: boolean = false;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    super('Loop Agent');
    this.googleAI = new GoogleAIService();
  }

  async process(location: { city: string; country: string }): Promise<NewsPost[]> {
    this.log(`Fetching news for ${location.city}, ${location.country}`);
    
    try {
      // Simulate fetching news from multiple sources
      const newsData = await this.fetchNewsFromSources(location);
      this.updateMetrics(true);
      return newsData;
    } catch (error) {
      this.log('Error fetching news:', error);
      this.updateMetrics(false);
      return [];
    }
  }

  private async fetchNewsFromSources(location: { city: string; country: string }): Promise<NewsPost[]> {
    const apiKey = process.env.NEWS_API_KEY;
    
    // Try real NewsAPI first
    if (apiKey) {
      try {
        const query = `${location.city} OR "${location.city}"`;
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          this.log(`NewsAPI returned ${data.articles?.length || 0} articles`);
          
          if (data.articles && data.articles.length > 0) {
            return data.articles
              .filter((article: any) => article.title && article.description)
              .slice(0, 5) // Limit to 5 articles
              .map((article: any) => ({
                id: `newsapi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: article.title,
                content: article.description || article.content?.substring(0, 500) || 'Content not available',
                source: article.source?.name || 'Unknown Source',
                url: article.url,
                publishedAt: article.publishedAt,
                location: location,
                tags: this.extractTags(article.title + ' ' + (article.description || ''))
              }));
          }
        }
      } catch (error) {
        this.log('NewsAPI request failed, using fallback data', error);
      }
    }
    
    // Fallback to enhanced mock data if API fails
    this.log('Using enhanced mock data for demo purposes');
    const mockNews: NewsPost[] = [
      {
        id: `news-${Date.now()}-1`,
        title: `Breaking: Local Development Project Approved in ${location.city}`,
        content: "City council unanimously approved the new community center project that will bring modern facilities to the downtown area.",
        source: "Local News Network",
        url: `https://example.com/news/${Date.now()}`,
        publishedAt: new Date().toISOString(),
        location: location,
        tags: ['development', 'community', 'government']
      },
      {
        id: `news-${Date.now()}-2`,
        title: `Weather Alert: Severe Storms Expected in ${location.city} Area`,
        content: "Meteorologists warn of potential severe weather conditions including heavy rain and strong winds expected this weekend.",
        source: "Weather Service",
        url: `https://example.com/weather/${Date.now()}`,
        publishedAt: new Date().toISOString(),
        location: location,
        tags: ['weather', 'alert', 'safety']
      },
      {
        id: `news-${Date.now()}-3`,
        title: `Local Business Initiative Supports ${location.city} Economy`,
        content: "New partnership between local businesses aims to boost economic growth and create job opportunities for residents.",
        source: "Business Journal",
        url: `https://example.com/business/${Date.now()}`,
        publishedAt: new Date().toISOString(),
        location: location,
        tags: ['business', 'economy', 'jobs']
      }
    ];

    // Add some randomization to make it feel more real
    return mockNews.filter(() => Math.random() > 0.3);
  }

  private extractTags(text: string): string[] {
    const keywords = [
      // Location tags
      'local', 'city', 'downtown', 'neighborhood', 'community',
      // News categories
      'breaking', 'alert', 'update', 'report', 'announcement',
      'weather', 'storm', 'rain', 'hurricane', 'flood', 'sunshine',
      'business', 'economy', 'jobs', 'employment', 'market', 'growth',
      'politics', 'government', 'election', 'council', 'mayor', 'policy',
      'sports', 'game', 'team', 'championship', 'season', 'player',
      'health', 'medical', 'hospital', 'treatment', 'vaccine', 'wellness',
      'education', 'school', 'university', 'student', 'teacher', 'learning',
      'technology', 'tech', 'digital', 'innovation', 'startup', 'app',
      'crime', 'police', 'arrest', 'investigation', 'safety', 'security',
      'traffic', 'road', 'construction', 'transportation', 'public transit',
      'event', 'festival', 'concert', 'celebration', 'cultural', 'arts'
    ];

    const lowerText = text.toLowerCase();
    const foundTags = keywords.filter(keyword => 
      lowerText.includes(keyword)
    ).slice(0, 5); // Limit to 5 tags

    return foundTags.length > 0 ? foundTags : ['general', 'local'];
  }

  startContinuousLoop(location: { city: string; country: string }, intervalMinutes: number = 5) {
    if (this.isRunning) {
      this.log('Loop already running');
      return;
    }

    this.isRunning = true;
    this.log(`Starting continuous news fetching every ${intervalMinutes} minutes`);

    this.intervalId = setInterval(async () => {
      const news = await this.process(location);
      this.log(`Fetched ${news.length} new articles`);
      
      // Emit news to other agents for processing
      this.emitNewsForProcessing(news);
    }, intervalMinutes * 60 * 1000);
  }

  stopLoop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.isRunning = false;
      this.log('Stopped continuous loop');
    }
  }

  private emitNewsForProcessing(news: NewsPost[]) {
    // In a real implementation, this would send to a queue or event system
    // For demo, we'll just log
    news.forEach(article => {
      this.log(`New article ready for processing: ${article.title}`);
    });
  }

  isLoopRunning(): boolean {
    return this.isRunning;
  }
}