## 🌍 Global News App

The Global News App is an interactive platform that combines a 3D globe with AI-powered news verification. Users can explore stories by city, view credibility scores, and check a transparency dashboard powered by AI agents that summarize and fact-check local and global news.

This project was built during a hackathon using Next.js, React, Three.js, Express.js, and MongoDB, with AI integrations for summarization and fact-checking.

## 🚀 Features

3D Interactive Globe: Zoom into a city to see local news.
Live News Feed: Stories ranked by credibility score.
AI Summarizer Agent: Generates TL;DR summaries of articles.
Fact-Check Agent: Validates headlines against trusted sources.
Transparency Dashboard: Shows how AI agents collaborate to verify content.

## 🛠️ Getting Started

### 1. Clone the repository
   
```
git clone https://github.com/FelipeChicaiza/ShellHacks2025.git
cd global-news
```

### 3. Install dependencies

Choose your package manager:

```
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
### 3. Run the development server
```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The app will be available at 👉 http://localhost:3000
.

## ⚙️ Project Structure

- app/page.tsx → Main entry point (Globe + News feed).
- components/Globe.tsx → 3D globe built with Three.js.
- components/NewsPanel.tsx → Side panel showing live news stories.
- components/GlobeMarker.jsx → Markers placed on the globe for clickable cities.
- backend/ → (optional setup) Express.js server for fetching/storing news data.

## 🤖 AI Integration

Summarizer Agent: Uses LLM APIs (e.g., Gemini) to create short summaries.
Fact-Check Agent: Cross-references sources with trusted APIs (Google News API).
These agents are designed to plug into the frontend for live verification.

## 📦 Tech Stack

**Frontend:** Next.js, React, TailwindCSS, Three.js
**Backend:** Express.js, MongoDB
**AI:** Generative AI APIs (Gemini / LLMs)
**Deployment**: Vercel (recommended for the future)

## 📝 Notes

- Environment variables (API keys for AI + MongoDB) should be placed in a .env.local file.
- The project auto-updates thanks to Next.js hot reloading.
- Fonts are optimized with next/font using Geist.
