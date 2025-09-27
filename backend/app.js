import express from 'express';
import { PORT } from './config/env.js';

import newsRouter from './routes/news.routes.js';
import connectToDatabase from './database/mongodb.js';

import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

app.use('/api/news', newsRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to ShellHacks 2025!');
});


app.listen(PORT, async () =>{
    console.log(`server running http://localhost:${PORT}`);

    await connectToDatabase();
});
