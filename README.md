# Global News App

🥇 **Step 1: Core User Experience (Frontend First)**

Why? Because judges need to see something working fast, even if the backend/agents are rough.

- Start with the globe → local feed scroll flow.
- Build the globe using Three.js (web) or Mapbox (mobile).
- Mock up the news feed with dummy data (JSON of headlines + summaries).
- Add scrolling gestures (vertical scroll cards, swipe actions).

👉 This gives you an MVP you can demo visually within a few hours.

---

🥈 **Step 2: Backend APIs & Database**

Once the UI works, make it real.

- Build a simple Express (Node.js) or FastAPI server.
- Set up a news post model → { title, summary, source, geotag, credibility_score }.
- Connect frontend feed → fetch posts from backend.
- Use Firebase or MongoDB for speed.

👉 Now your feed is powered by live data, not just mockups.

---

🥉 **Step 3: Agents (Google ADK/A2A)**

Once the globe + feed is live, add your innovation layer.

- Implement Loop Agent to continuously check new posts.
- Add 1–2 Parallel Agents (keep it simple for hackathon):
  - Summarizer Agent (Gemini API or LLM → TL;DR news).
  - Fact-Check Agent (cross-check against Google News API).
- Show an AI Transparency Dashboard (even if basic) → judges will love this.

👉 Even with just 2 agents working together, you can prove the “autonomous system” angle.

---

🏆 **Step 4: Polish for Demo**

- Add reactions (support / disagree / save).
- Add user posting flow (optional if time).
- Prepare a clean demo script:
  1. Open app → globe → Miami.
  2. Scroll feed shows AI-verified local stories.
  3. Tap story → see AI trust report.
  4. Show transparency dashboard of agents collaborating.
