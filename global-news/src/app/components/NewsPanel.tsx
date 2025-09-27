"use client";

import React from 'react';
import { motion } from 'framer-motion'; // We'll use this for a smooth animation

// Define the type for a single news item
interface NewsItem {
  _id: string;
  title: string;
  summary: string;
  source: string;
  credibility_score: number;
  city: string;
}

interface NewsPanelProps {
  news: NewsItem[];
  onClose: () => void;
  // New prop to manage the hover state from the parent
  onMouseEnter: () => void; 
}

export default function NewsPanel({ news, onClose, onMouseEnter }: NewsPanelProps) {
  const sortedNews = [...news].sort((a, b) => b.credibility_score - a.credibility_score);

  return (
    // This div is now positioned on the right side of the screen
    <motion.div
      className="absolute top-1/2 right-4 transform -translate-y-1/2 w-full max-w-sm"
      onMouseEnter={onMouseEnter} // This helps prevent the flickering
      onMouseLeave={onClose}     // This closes the panel when the mouse leaves it
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm text-white rounded-lg shadow-xl h-[70vh] max-h-[600px] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-300">
            News for {news[0]?.city || 'Selected City'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="overflow-y-auto p-4 flex-grow">
          {sortedNews.map((item) => (
            <div key={item._id} className="mb-4 p-3 bg-gray-900 bg-opacity-50 rounded-lg">
              <h3 className="font-bold text-md mb-1">{item.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{item.summary}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{item.source}</span>
                <span className="font-bold text-green-400">Trust: {item.credibility_score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}