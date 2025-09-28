import { Router} from 'express';
import { agentManager } from '../agents/AgentManager.js'; // adjust path

const agentsRouter = Router();

agentsRouter.get('/', async (req , res) => {
  try {
    const [transparency, database] = await Promise.all([
      Promise.resolve(agentManager.getTransparencyReport?.()),
      Promise.resolve(agentManager.getDatabaseStats?.()),
    ]);

    res.json({
      success: true,
      transparency,
      database,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Agents API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, error: message });
  }
});

export default agentsRouter;