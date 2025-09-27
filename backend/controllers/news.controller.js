import News from '../models/news.js';

// Get all news posts
export const getAllNews = async (req, res, next) => {
  try {
    const news = await News.find();
    res.json({ success: true, data: news });
  } catch (err) {
    next(err);
  }
};

// Create a new news post
export const createNews = async (req, res, next) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json({ success: true, data: news });
  } catch (err) {
    next(err);
  }
};

// Get all news posts for a specific city
export const getNewsByCity = async (req, res, next) => {
  try {
    const { city } = req.params;
    const news = await News.find({ city });
    res.json({ success: true, data: news });
  } catch (err) {
    next(err);
  }
};      
