import News from '../models/news.js';

// Get all news posts
export const getAllNews = async (req, res) => {
  try {
    // This command finds all documents in the "news" collection
    const news = await News.find();

    // This sends the data back to the frontend as a JSON response
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
