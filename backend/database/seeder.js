import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: './.env.development.local' });

// Load models
import News from '../models/news.js';

// Connect to DB
mongoose.connect(process.env.DB_URI);

// Read JSON files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const news = JSON.parse(
  fs.readFileSync(`${__dirname}/seedData.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await News.deleteMany(); // Clear existing news
    await News.create(news);
    console.log('✅ Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();