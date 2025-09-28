import { Router } from 'express';
import { agentManager } from '../agents/AgentManager.js';
import { createNews } from '../controllers/news.controller.js';

const newsDataRouter = Router();

// GET /api/news?city=&country=&limit=&credibilityThreshold=
newsDataRouter.get('/', async (req, res, next) => {
  try {
    const {
      city = 'Tokyo',
      country = 'United States',
      limit = '5',
      credibilityThreshold = '0',
    } = req.query;

    const limitNum = Number.parseInt(limit, 10) || 5;
    const credNum = Number.parseInt(credibilityThreshold, 10) || 0;

    // 1) Try agentManager cache/store first
    const news =
      (await Promise.resolve(
        agentManager.getNews?.({
          location: city,
          limit: limitNum,
          credibilityThreshold: credNum,
        })
      )) || [];

    // 2) If nothing, trigger pipeline, then SAVE via your controller
    if (news.length === 0) {
      console.log('No news found, triggering fetch pipeline...');
      const result = await agentManager.startNewsProcessingPipeline?.({
        city,
        country,
      });

      // If pipeline produced articles, hand them to your controller to persist
      if (result?.success && Array.isArray(result.articles) && result.articles.length > 0) {
        // Call your batch-ingest controller by faking req.body = { data: [...] }
        // IMPORTANT: return here because createNews will send the response.
        const saveReq = { ...req, body: { data: result.articles } };
        return createNews(saveReq, res, next);
      }

      // Pipeline returned nothing → empty payload
      return res.json({
        success: true,
        data: [],
        message: 'No articles found from pipeline',
        stats: agentManager.getDatabaseStats?.(),
      });
    }

    // 3) We had news already — just return it
    return res.json({
      success: true,
      data: news,
      message: `Retrieved ${news.length} articles`,
      stats: agentManager.getDatabaseStats?.(),
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    });
  }
});

// POST /api/news  { action: 'fetch' | 'start-auto' | 'stop-auto', city?, country? }
// Also supports direct ingest: { data: [...] }  (reuses your createNews)
newsDataRouter.post('/', async (req, res, next) => {
  try {
    // If the caller sends { data: [...] } directly, reuse your controller as-is
    if (Array.isArray(req.body?.data)) {
      return createNews(req, res, next);
    }

    const { city = 'Miami', country = 'United States', action } = req.body ?? {};

    if (action === 'fetch') {
      const result = await agentManager.startNewsProcessingPipeline?.({ city, country });

      // If we got articles from the pipeline, SAVE them using your controller
      if (result?.success && Array.isArray(result.articles) && result.articles.length > 0) {
        const saveReq = { ...req, body: { data: result.articles } };
        return createNews(saveReq, res, next);
      }

      // Otherwise just return whatever the agent returned
      return res.json(result ?? { success: false, data: [], message: 'No result from pipeline' });
    }
    
    if (action === 'start-auto') {
      const intervalMinutes = 10; // Fetch every 10 minutes
      agentManager.startAutomaticProcessing?.({ city, country }, intervalMinutes);
      return res.json({
        success: true,
        message: `Started automatic processing for ${city}, ${country}`,
        interval: intervalMinutes,
      });
    }

    if (action === 'stop-auto') {
      agentManager.stopAutomaticProcessing?.();
      return res.json({
        success: true,
        message: 'Stopped automatic processing',
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid action or body. Provide { action } or { data: [...] }',
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default newsDataRouter;
