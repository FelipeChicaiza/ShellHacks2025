/*import express from 'express';
import {
  getAllNews,
  createNews
} from '../controllers/newsController.js';

const router = express.Router();

// GET /api/news - fetch all news posts
router.get('/', getAllNews);

// POST /api/news - create a new news post
router.post('/', createNews);


export default router;
*/

import { Router } from 'express';

const newsRouter = Router();

// Example route to get all news posts
newsRouter.get('/', (req, res) => {
  res.send({title: "Fetch all news posts"});
});


newsRouter.get('/id', (req, res) => {
  res.send({title: "Fetch news post by ID"});
});
// Example route to create a new news post
newsRouter.post('/', (req, res) => {
  res.send({title: "Create a new news post"});
});

export default newsRouter;
