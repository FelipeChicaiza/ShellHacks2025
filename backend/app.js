import express from 'express';
import { PORT } from './config/env.js';

import cors from 'cors';
import newsRouter from './routes/news.routes.js';
import connectToDatabase from './database/mongodb.js';
import agentsRouter from './routes/agent.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import newsDataRouter from './routes/news.data.routes.js';


const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/news', newsRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/news/show', newsDataRouter);


app.use(express.urlencoded({ extended: true }));

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to ShellHacks 2025!');
});


app.listen(PORT, async () =>{
    console.log(`server running http://localhost:${PORT}`);

    await connectToDatabase();
});
