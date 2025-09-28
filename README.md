## ✨ Inspiration

We wanted to build a news experience that feels local 🌆, global 🌍, and trustworthy ✅ at the same time. With so much misinformation 🚫 and overwhelming feeds, people often don’t know which headlines to believe. Our goal was to combine interactive visualization 🕹️ with AI-driven transparency 🤖🔍 so users can quickly see news from their city or across the globe — and understand why it’s credible.

## 🚀 What it does

Global News App lets users:

  - 🌍 Explore a 3D interactive globe to zoom into a city of interest.
  - View a live local feed of stories with credibility scores.
  - Read AI-generated summaries for fast context.
  - Check a Transparency Dashboard that shows how agents fact-check and cross-reference stories.

This makes news consumption faster ⏱️, more engaging 🎯, and more trustworthy 🛡️.

## 🛠️ How we built it

### Frontend (MVP First):

- Built an interactive globe with Three.js.
- Created a clean news feed with React + TailwindCSS, starting with mock data.

### Backend & Database:

- Developed APIs with Express.js.
- Stored news posts (title, summary, source, geotag, credibility score) in MongoDB.

### AI Agents:

- Summarizer Agent → creates TL;DR versions of articles.
- Fact-Check Agent → validates headlines against trusted sources (e.g., Google News API).

## 🧩 Challenges we ran into

- Balancing hackathon speed with feature complexity (building globe UI + AI pipeline in <48 hrs).
- Designing a credibility scoring system that feels transparent but still lightweight.
- Debugging rendering issues with Three.js and keeping performance smooth.
- Coordinating backend & frontend work under tight deadlines.

## 🏆 Accomplishments that we're proud of

- Built a working globe-to-feed flow that feels polished and demo-ready.
- Integrated AI agents for real-time summarization & fact-checking.
- Delivered a national-scale project in hackathon time while keeping it simple & engaging.
- Showcased a transparency layer that makes the AI process understandable (not a black box).

## 📚 What we learned

- How to quickly prototype with Three.js + React under time pressure.
- The importance of visual MVPs before backend complexity.
- How to design simple but effective multi-agent workflows.
- That transparency in AI is just as important as accuracy when it comes to trust.

## 🔮 What's next for Global News Network

- 📝 User posting flow → allow communities to contribute their own stories.
- 🤖 More AI agents → bias detection, translation for global accessibility.
- 📱 Mobile version → gestures, push notifications for local updates.
- 📰 Partnerships with news outlets → provide verified feeds at scale.


# **OPEN FRONTEND FOR DETAILS ON HOW TO LOCALLY RUN THE PROJECT**

