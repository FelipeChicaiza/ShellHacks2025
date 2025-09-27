import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export async function fetchTopHeadlines({ city, country, pageSize = 5 }) {
  if (!NEWS_API_KEY) {
    // Return mocked data when key missing
    return [
      { id: `mock-${Date.now()}`, title: `Mock headline for ${city}`, description: `Mock description for ${city}`, publishedAt: new Date().toISOString(), source: { name: 'mock' } }
    ];
  }

  const q = encodeURIComponent(`${city} OR ${country}`);
  const url = `https://newsapi.org/v2/top-headlines?q=${q}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`NewsAPI error: ${resp.status} ${resp.statusText}`);
  const data = await resp.json();
  return (data.articles || []).map(a => ({ id: a.url || `news-${Math.random()}`, title: a.title, description: a.description || a.content || '', publishedAt: a.publishedAt, source: a.source }));
}
