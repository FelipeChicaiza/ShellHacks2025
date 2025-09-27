# Backend (ShellHacks2025)

This folder contains the Express backend for the ShellHacks2025 project.

Quick start

1. Copy the example env file and edit secrets:

   cp .env.example .env.development.local
   # edit .env.development.local and set DB_URI/AGENTS_API_TOKEN etc.

2. Install dependencies:

   cd backend
   npm install

3. Run in development:

   npm run dev

Endpoints (agent control)

- POST /api/agents/start
  - body: { city, country }
  - starts a one-off pipeline (fetch -> summarize -> fact-check)

- POST /api/agents/process-now
  - alias for /start

- POST /api/agents/start-auto
  - body: { city, country, intervalMinutes }
  - starts periodic processing

- POST /api/agents/stop-auto
  - stop periodic processing

- POST /api/agents/stop
  - stop processing and loops

- GET /api/agents/status
  - returns transparency report and DB stats

Authentication

- Control endpoints are protected by a simple bearer token read from `AGENTS_API_TOKEN` in the env. For demo use set `AGENTS_API_TOKEN=changeme` and pass header `Authorization: Bearer changeme`.

Notes / Next steps

- The LoopAgent uses the News API (NewsAPI.org) when `NEWS_API_KEY` is present. Without it, it returns a mocked article for demo.
- The SummarizerAgent is wired to a simple Gemini ADK wrapper (`GEMINI_API_KEY` and `GEMINI_API_URL`) — set real keys to use production LLM.
- Processed articles are saved to MongoDB (Mongoose `News` model) when the DB is available, otherwise cached in-memory.
