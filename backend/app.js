import express from 'express';
import { PORT } from './config/env.js';
import cors from 'cors';
import newsRouter from './routes/news.routes.js';
import connectToDatabase from './database/mongodb.js';
import agentsRouter from './routes/agent.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import newsDataRouter from './routes/news.data.routes.js';


const app = express();

// CORS Configuration to allow requests from your frontend

const corsOptions = {
  origin: 'http://localhost:5002',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// --- Middleware Setup ---
// 1. Enable CORS with your specific options


// 2. Parsers for JSON and URL-encoded data
app.use(express.json());
app.use('/api/news', newsRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/news/show', newsDataRouter);


app.use(express.urlencoded({ extended: true }));

// 3. API Routes
app.use('/api/news', newsRouter);

// 4. Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to ShellHacks 2025!');
});

// 5. Error Handling Middleware (should be last)
app.use(errorMiddleware);


app.listen(PORT, async () => {
    console.log(`server running http://localhost:${PORT}`);
    await connectToDatabase();
});