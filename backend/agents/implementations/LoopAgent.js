import { fetchTopHeadlines } from '../clients/newsApi.client.js';

export default class LoopAgent {
  constructor() {
    this.tasksCompleted = 0;
    this.tasksFailed = 0;
    this.lastActive = null;
    this._running = false;
  }

  async process(location) {
    this.lastActive = new Date().toISOString();
    try {
      const articles = await fetchTopHeadlines({ city: location.city, country: location.country, pageSize: 6 });
      this.tasksCompleted += articles.length;
      return articles.map(a => ({ id: a.id, title: a.title, summary: a.description || '', location: { city: location.city, country: location.country }, publishedAt: a.publishedAt, source: a.source }));
    } catch (err) {
      this.tasksFailed += 1;
      console.error('LoopAgent fetch error', err);
      return [];
    }
  }

  startContinuousLoop(location, intervalMinutes = 10) {
    this._running = true;
    this._interval = setInterval(() => this.process(location).catch(() => {}), intervalMinutes * 60 * 1000);
  }

  stopLoop() {
    this._running = false;
    if (this._interval) clearInterval(this._interval);
  }

  getMetrics() {
    return { tasksCompleted: this.tasksCompleted, tasksFailed: this.tasksFailed, lastActive: this.lastActive };
  }
}
