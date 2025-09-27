export default class FactCheckAgent {
  constructor() {
    this.tasksCompleted = 0;
    this.tasksFailed = 0;
    this.lastActive = null;
  }

  // placeholder fact-check: mark articles with random verdicts
  async processBatch(articles) {
    this.lastActive = new Date().toISOString();
    return articles.map(a => {
      const verdict = Math.random() > 0.5 ? 'verified' : 'unverified';
      const credibilityScore = verdict === 'verified' ? 90 + Math.floor(Math.random() * 10) : 30 + Math.floor(Math.random() * 40);
      this.tasksCompleted += 1;
      return { ...a, factCheckStatus: verdict, credibilityScore, factCheckedAt: new Date().toISOString() };
    });
  }

  getFactCheckMetrics() {
    return { tasksCompleted: this.tasksCompleted, tasksFailed: this.tasksFailed, lastActive: this.lastActive };
  }
}
