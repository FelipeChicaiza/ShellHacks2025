import express from 'express';
import { PORT } from './config/env.js';
import cors from 'cors';
import newsRouter from './routes/news.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// CORS Configuration to allow requests from your frontend
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// --- Middleware Setup ---
// 1. Enable CORS with your specific options
app.use(cors(corsOptions));

// 2. Parsers for JSON and URL-encoded data
app.use(express.json());
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