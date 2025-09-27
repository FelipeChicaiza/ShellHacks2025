import express from 'express';
import {
  getAllNews,
  createNews,
  getNewsByCity
} from '../controllers/news.controller.js';

const router = express.Router();

// GET /api/news - Fetches all news posts
router.get('/', getAllNews);

// GET /api/news/:city - Fetches news posts by city
router.get('/:city', getNewsByCity);

// POST /api/news - Creates a new news post
router.post('/', createNews);

export default router;