// Agent Types and Interfaces
export interface NewsPost {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: string;
  location: {
    city: string;
    country: string;
    coordinates?: [number, number]; // [lat, lng]
  };
  summary?: string;
  credibilityScore?: number;
  factCheckStatus?: 'verified' | 'disputed' | 'pending' | 'unverified';
  factCheckReport?: string;
  tags?: string[];
  agentProcessed?: {
    summarized: boolean;
    factChecked: boolean;
    processedAt: string;
  };
}

export interface AgentTask {
  id: string;
  type: 'summarize' | 'fact-check' | 'fetch-news';
  newsPostId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  result?: unknown;
  error?: string;
}

export interface AgentMetrics {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksFailed: number;
  avgProcessingTime: number;
  lastActive: string;
}

export interface TransparencyReport {
  agentMetrics: {
    loopAgent: AgentMetrics;
    summarizerAgent: AgentMetrics;
    factCheckAgent: AgentMetrics;
  };
  recentActivity: AgentTask[];
  systemHealth: 'healthy' | 'degraded' | 'error';
}