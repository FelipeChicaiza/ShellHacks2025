import { BaseAgent, GoogleAIService } from './BaseAgent.js';

export class LoopAgent extends BaseAgent {
  constructor() {
    super('Loop Agent');
    this.googleAI = new GoogleAIService();
    this.isRunning = false;
    this.intervalId = undefined;
  }

  async process(location) {
    this.log(`Fetching news for ${location.city}, ${location.country}`);
    try {
      const newsData = await this.fetchNewsFromSources(location);
      this.updateMetrics(true);
      return newsData;
    } catch (error) {
      this.log('Error fetching news:', error);
      this.updateMetrics(false);
      return [];
    }
  }

  async fetchNewsFromSources(location) {
    const apiKey = process.env.NEWS_API_KEY;
    if (apiKey) {
      try {
        const query = `${location.city} OR "${location.city}"`;
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=10&apiKey=${apiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          this.log(`NewsAPI returned ${data.articles?.length || 0} articles`);
          if (data.articles && data.articles.length > 0) {
            return data.articles.filter(a => a.title && a.description).slice(0, 5).map(article => ({
              id: `newsapi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: article.title,
              content: article.description || (article.content && article.content.substring(0, 500)) || 'Content not available',
              source: (article.source && article.source.name) || 'Unknown Source',
              url: article.url,
              publishedAt: article.publishedAt,
              location,
              tags: this.extractTags((article.title || '') + ' ' + (article.description || ''))
            }));
          }
        }
      } catch (error) {
        this.log('NewsAPI request failed, using fallback data', error);
      }
    }
    this.log('Using enhanced mock data for demo purposes');
    const mockNews = [
      { id: `news-${Date.now()}-1`, title: `Breaking: Local Development Project Approved in ${location.city}`, content: 'City council unanimously approved the new community center project that will bring modern facilities to the downtown area.', source: 'Local News Network', url: `https://example.com/news/${Date.now()}`, publishedAt: new Date().toISOString(), location, tags: ['development', 'community', 'government'] },
      { id: `news-${Date.now()}-2`, title: `Weather Alert: Severe Storms Expected in ${location.city} Area`, content: 'Meteorologists warn of potential severe weather conditions including heavy rain and strong winds expected this weekend.', source: 'Weather Service', url: `https://example.com/weather/${Date.now()}`, publishedAt: new Date().toISOString(), location, tags: ['weather', 'alert', 'safety'] },
      { id: `news-${Date.now()}-3`, title: `Local Business Initiative Supports ${location.city} Economy`, content: 'New partnership between local businesses aims to boost economic growth and create job opportunities for residents.', source: 'Business Journal', url: `https://example.com/business/${Date.now()}`, publishedAt: new Date().toISOString(), location, tags: ['business', 'economy', 'jobs'] }
    ];
    return mockNews.filter(() => Math.random() > 0.3);
  }

  extractTags(text) {
    const keywords = ['local','city','downtown','neighborhood','community','breaking','alert','update','report','announcement','weather','storm','rain','business','economy','jobs','politics','government','sports','health','education','technology','crime','traffic','event'];
    const lowerText = text.toLowerCase();
    const foundTags = keywords.filter(keyword => lowerText.includes(keyword)).slice(0,5);
    return foundTags.length > 0 ? foundTags : ['general','local'];
  }

  startContinuousLoop(location, intervalMinutes = 5) {
    if (this.isRunning) { this.log('Loop already running'); return; }
    this.isRunning = true;
    this.log(`Starting continuous news fetching every ${intervalMinutes} minutes`);
    this.intervalId = setInterval(async () => {
      const news = await this.process(location);
      this.log(`Fetched ${news.length} new articles`);
      this.emitNewsForProcessing(news);
    }, intervalMinutes * 60 * 1000);
  }

  stopLoop() {
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = undefined; this.isRunning = false; this.log('Stopped continuous loop'); }
  }

  emitNewsForProcessing(news) { news.forEach(article => this.log(`New article ready for processing: ${article.title}`)); }

  isLoopRunning() { return this.isRunning; }
}
