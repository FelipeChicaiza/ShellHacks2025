import express from 'express';
import { PORT } from './config/env.js';

import newsRouter from './routes/news.routes.js';

const app = express();



app.use('/api/news', newsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to ShellHacks 2025!');
});


app.listen(PORT, () =>{
    console.log(`server running http://localhost:${PORT}`);
});
