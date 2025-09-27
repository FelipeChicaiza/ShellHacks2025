import express from 'express';
import { PORT } from './config/env.js';

const app = express();


app.get('/', (req, res) => {
  res.send('Welcome to ShellHacks 2025!');
});


app.listen(PORT, () =>{
    console.log(`server running http://localhost:${PORT}`);
});
