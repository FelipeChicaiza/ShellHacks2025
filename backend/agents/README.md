Backend agents folder

This folder contains server-side AI agents and manager.

Files:
- AgentManager.js - orchestrates agents and exposes create/get functions
- implementations/ - concrete agent implementations (LoopAgent, SummarizerAgent, FactCheckAgent)
- index.js - exports createAgentManager and getAgentManager

Note: Keep secrets (API keys) in backend/.env and never commit them.
