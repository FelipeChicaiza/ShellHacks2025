"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define the type for a single news item
interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  source: string;
  credibility_score: number;
  city: string;
}

export default function HighlightsPanel() {
  const [topNews, setTopNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const API_URL = "http://localhost:5001/api/news";
    fetch(API_URL)
      .then(response => response.json())
      .then(apiResponse => {
        if (apiResponse.success && apiResponse.data.length > 0) {
          // Find the single most credible news story
          const mostRelevant = [...apiResponse.data].sort(
            (a, b) => b.credibility_score - a.credibility_score
          )[0];
          setTopNews(mostRelevant);
        }
      })
      .catch(error => console.error("Error fetching highlights:", error));
  }, []);

  if (!topNews) {
    return null; // Don't render anything if there's no news
  }

  return (
    <motion.div
      // Adjusted positioning and size for a smaller, more square look
      className="absolute top-1/3 left-8 w-full max-w-xs h-[340px] pointer-events-none"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
    >
      <div className="bg-stone-100 text-black rounded-lg shadow-2xl h-full p-4 flex flex-col newspaper-style pointer-events-auto overflow-y-auto custom-scrollbar">
        <h1 className="text-3xl font-bold mb-2 text-center border-b-2 border-black pb-2">
          The Global Times
        </h1>
        <p className="text-center text-xs text-gray-600 mb-3">{new Date().toDateString()}</p>
        
        <div className="mt-2">
          <h2 className="text-xl font-bold leading-tight mb-2 font-bebas">
            {topNews.title}
          </h2>
          <p className="text-sm leading-relaxed first-letter-large">
            {topNews.summary}
          </p>
          <div className="text-right mt-3 text-sm italic text-gray-700">
            - {topNews.source}, {topNews.city}
          </div>
        </div>
      </div>
    </motion.div>
  );
}