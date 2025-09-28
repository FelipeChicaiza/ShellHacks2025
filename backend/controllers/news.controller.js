import News from '../models/news.js';
import { getGeotag } from "../utils/geotagHelper.js";

// Get all news posts
export const getAllNews = async (req, res, next) => {
  try {
    const news = await News.find();
    res.json({ success: true, data: news });
  } catch (err) {
    next(err);
  }
};

function apiToNewsDoc(item) {
  if (!item?.title) throw new Error("Missing title");
  if (!item?.summary && !item?.content) throw new Error("Missing summary/content");
  if (!item?.source) throw new Error("Missing source");
  if (!item?.location?.city) throw new Error("Missing city");

  const city = item.location.city;
  const geotag = getGeotag(city);

  return {
    title: item.title,
    summary: item.summary ?? item.content,
    source: item.source,
    city,
    geotag, // will be {lat, lng} if found, or null
    credibility_score: typeof item.credibilityScore === "number" ? item.credibilityScore : 0,
  };
}


export const createNews = async (req, res, next) => {
  try {
    const items = Array.isArray(req.body?.data) ? req.body.data : [];
    const docs = items.map(apiToNewsDoc);
    const created = await News.insertMany(docs, { ordered: false });
    res.status(201).json({ success: true, count: created.length, data: created });
  } catch (err) {
    next(err);
  }
};

/*
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

*/

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
