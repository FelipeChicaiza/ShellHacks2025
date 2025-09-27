import { Router } from 'express';
import { getAgentManager } from '../agents/AgentManager.js';
import agentsAuth from '../middlewares/agentsAuth.middleware.js';

const router = Router();

// Use singleton manager so state persists across requests
const manager = getAgentManager();

// protect all routes with a simple bearer token
router.use(agentsAuth);

// Start a one-off processing pipeline
router.post('/start', async (req, res, next) => {
  try {
    const { city, country } = req.body || {};
    if (!city || !country) return res.status(400).json({ success: false, message: 'city and country are required' });
    const result = await manager.startNewsProcessingPipeline({ city, country });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Start processing immediately (alias)
router.post('/process-now', async (req, res, next) => {
  try {
    const { city, country } = req.body || {};
    const result = await manager.startNewsProcessingPipeline({ city, country });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Start automatic/periodic processing
router.post('/start-auto', (req, res) => {
  const { city, country, intervalMinutes } = req.body || {};
  if (!city || !country) return res.status(400).json({ success: false, message: 'city and country are required' });
  manager.startAutomaticProcessing({ city, country }, intervalMinutes || 10);
  res.json({ success: true, message: 'Automatic processing started' });
});

// Stop automatic processing
router.post('/stop-auto', (req, res) => {
  manager.stopAutomaticProcessing();
  res.json({ success: true, message: 'Automatic processing stopped' });
});

// Generic stop (stop automatic processing and agent loops)
router.post('/stop', (req, res) => {
  manager.stopAutomaticProcessing();
  // also attempt to stop loop agent explicitly if available
  if (manager.loopAgent && typeof manager.loopAgent.stopLoop === 'function') manager.loopAgent.stopLoop();
  res.json({ success: true, message: 'Processing stopped' });
});

// Get status / transparency report
router.get('/status', (req, res) => {
  try {
    const report = manager.getTransparencyReport();
    const stats = manager.getDatabaseStats();
    res.json({ success: true, report, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Unknown error' });
  }
});

export default router;
