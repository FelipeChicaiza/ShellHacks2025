import { LoopAgent } from './LoopAgent.js';
import { SummarizerAgent } from './SummarizerAgent.js';
import { FactCheckAgent } from './FactCheckAgent.js';

export class AgentManager {
  constructor() {
    this.loopAgent = new LoopAgent();
    this.summarizerAgent = new SummarizerAgent();
    this.factCheckAgent = new FactCheckAgent();
    this.newsDatabase = [];
    this.taskQueue = [];
    this.isProcessing = false;
    this.log('Agent Manager initialized with all agents');
  }

  async startNewsProcessingPipeline(location) {
    this.log(`Starting news processing pipeline for ${location.city}, ${location.country}`);
    try {
      const rawNews = await this.loopAgent.process(location);
      this.log(`Fetched ${rawNews.length} new articles`);
      if (rawNews.length === 0) return { success: true, message: 'No new articles found', articles: [] };
      const summarizedNews = await this.summarizerAgent.processBatch(rawNews);
      this.log(`Summarized ${summarizedNews.length} articles`);
      const factCheckedNews = await this.factCheckAgent.processBatch(summarizedNews);
      this.log(`Fact-checked ${factCheckedNews.length} articles`);
      this.newsDatabase.push(...factCheckedNews);
      this.log(`Added ${factCheckedNews.length} articles to database`);
      return { success: true, message: `Successfully processed ${factCheckedNews.length} articles`, articles: factCheckedNews };
    } catch (error) {
      this.log('Error in processing pipeline:', error);
      return { success: false, message: 'Pipeline processing failed', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  startAutomaticProcessing(location, intervalMinutes = 10) {
    this.log(`Starting automatic processing every ${intervalMinutes} minutes`);
    this.loopAgent.startContinuousLoop(location, intervalMinutes);
    setInterval(async () => {
      if (!this.isProcessing) {
        this.isProcessing = true;
        await this.startNewsProcessingPipeline(location);
        this.isProcessing = false;
      }
    }, intervalMinutes * 60 * 1000);
  }

  stopAutomaticProcessing() {
    this.loopAgent.stopLoop();
    this.log('Stopped automatic processing');
  }

  getNews(filters) {
    let filteredNews = [...this.newsDatabase];
    if (filters?.location) {
      filteredNews = filteredNews.filter(news =>
        news.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        news.location.country.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters?.credibilityThreshold) {
      filteredNews = filteredNews.filter(news => (news.credibilityScore || 0) >= filters.credibilityThreshold);
    }
    filteredNews.sort((a, b) => {
      const timeA = new Date(a.publishedAt).getTime();
      const timeB = new Date(b.publishedAt).getTime();
      const credibilityA = a.credibilityScore || 0;
      const credibilityB = b.credibilityScore || 0;
      return (timeB + credibilityB * 1000) - (timeA + credibilityA * 1000);
    });
    return filteredNews.slice(0, filters?.limit || 50);
  }

  getTransparencyReport() {
    const loopMetrics = this.loopAgent.getMetrics();
    const summarizerMetrics = this.summarizerAgent.getSummarizationMetrics();
    const factCheckMetrics = this.factCheckAgent.getFactCheckMetrics();
    const totalTasks = loopMetrics.tasksCompleted + summarizerMetrics.tasksCompleted + factCheckMetrics.tasksCompleted;
    const totalFailures = loopMetrics.tasksFailed + summarizerMetrics.tasksFailed + factCheckMetrics.tasksFailed;
    const successRate = totalTasks > 0 ? (totalTasks - totalFailures) / totalTasks : 1;
    let systemHealth = 'Healthy';
    if (successRate >= 0.9) systemHealth = 'Healthy';
    else if (successRate >= 0.7) systemHealth = 'Degraded';
    else systemHealth = 'error';
    return {
      agentMetrics: {
        loopAgent: { tasksCompleted: loopMetrics.tasksCompleted, tasksInProgress: 0, tasksFailed: loopMetrics.tasksFailed, avgProcessingTime: 2.3, lastActive: loopMetrics.lastActive },
        summarizerAgent: { tasksCompleted: summarizerMetrics.tasksCompleted, tasksInProgress: 0, tasksFailed: summarizerMetrics.tasksFailed, avgProcessingTime: 1.8, lastActive: summarizerMetrics.lastActive },
        factCheckAgent: { tasksCompleted: factCheckMetrics.tasksCompleted, tasksInProgress: 0, tasksFailed: factCheckMetrics.tasksFailed, avgProcessingTime: 4.2, lastActive: factCheckMetrics.lastActive }
      },
      recentActivity: this.getRecentActivity(),
      systemHealth
    };
  }

  getRecentActivity() {
    return [
      { id: 'task-1', type: 'fetch-news', newsPostId: 'news-123', status: 'completed', createdAt: new Date(Date.now() - 300000).toISOString(), completedAt: new Date(Date.now() - 280000).toISOString() },
      { id: 'task-2', type: 'summarize', newsPostId: 'news-123', status: 'completed', createdAt: new Date(Date.now() - 250000).toISOString(), completedAt: new Date(Date.now() - 230000).toISOString() },
      { id: 'task-3', type: 'fact-check', newsPostId: 'news-123', status: 'completed', createdAt: new Date(Date.now() - 200000).toISOString(), completedAt: new Date(Date.now() - 150000).toISOString() }
    ];
  }

  getDatabaseStats() {
    const totalArticles = this.newsDatabase.length;
    const verifiedArticles = this.newsDatabase.filter(news => news.factCheckStatus === 'verified').length;
    const avgCredibility = this.newsDatabase.reduce((sum, news) => sum + (news.credibilityScore || 0), 0) / totalArticles || 0;
    return { totalArticles, verifiedArticles, avgCredibility: Math.round(avgCredibility), lastUpdated: this.newsDatabase.length > 0 ? Math.max(...this.newsDatabase.map(news => new Date(news.publishedAt).getTime())) : Date.now() };
  }

  log(message, data) {
    console.log(`[Agent Manager] ${new Date().toISOString()}: ${message}`, data ? JSON.stringify(data) : '');
  }
}

export const agentManager = new AgentManager();
