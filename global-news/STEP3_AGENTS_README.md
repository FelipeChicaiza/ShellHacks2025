# Step 3: AI Agents System (Google ADK/A2A)

## Overview

This is the **Step 3** implementation for the ShellHacks2025 Global News App. This step provides autonomous AI agents that process news data using Google's AI services.

## Core Components

### 1. Agent System (`src/agents/`)

- **BaseAgent.ts** - Core agent class with Google AI integration
- **LoopAgent.ts** - Continuously fetches news from external sources
- **SummarizerAgent.ts** - AI-powered news summarization
- **FactCheckAgent.ts** - Multi-source fact verification
- **AgentManager.ts** - Orchestrates all agents
- **types.ts** - TypeScript definitions

### 2. API Endpoints (`src/app/api/`)

- **`/api/agents`** - Agent status and management
- **`/api/news`** - News processing pipeline

## Key Features

### 🔄 Loop Agent

- Fetches real news from NewsAPI
- Processes articles every 10 minutes
- Extracts relevant tags and metadata

### 📝 Summarizer Agent

- Uses Google Gemini AI for intelligent summaries
- Batch processing for efficiency
- Maintains original context and key points

### ✅ Fact-Check Agent

- Cross-references multiple news sources
- AI-powered content analysis
- Credibility scoring (0-100)

### 🎛️ Agent Manager

- Coordinates all agents in processing pipeline
- Real-time transparency reporting
- Performance metrics tracking

## Environment Setup

```bash
# Required API Keys
GOOGLE_AI_API_KEY=your_gemini_api_key_here
NEWS_API_KEY=your_newsapi_key_here
```

## API Usage

### Get Agent Status

```bash
GET /api/agents
```

### Process News

```bash
POST /api/news
# Returns processed news with AI summaries and fact-checks
```

### Get News Feed

```bash
GET /api/news?city=miami&limit=20
```

## Integration Points

This Step 3 system is designed to integrate with:

- **Step 1**: Frontend will consume `/api/news` and `/api/agents`
- **Step 2**: Backend will provide news data to agent pipeline
- **Step 4**: Real-time features will use agent status updates

## Demo Commands

```bash
# Start the agents system
npm run dev

# Test agent endpoints
curl http://localhost:3000/api/agents
curl http://localhost:3000/api/news
```

The agents run autonomously and provide transparency reporting for AI operations.
