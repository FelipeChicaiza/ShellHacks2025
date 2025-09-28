import { Router } from 'express';
import {createNews, getNewsByCity} from '../controllers/news.controller.js';

const newsRouter = Router();

// Example route to get all news posts
newsRouter.get('/', (req, res) => {

  res.send({title: "Fetch all news posts"});
});


newsRouter.get('/city/:city', getNewsByCity);

// Example route to create a new news post
newsRouter.post('/', createNews);

export default newsRouter;
