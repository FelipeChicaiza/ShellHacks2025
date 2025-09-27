"use client";

import React from 'react';

// Define the type for a single news item to ensure type safety
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
  onClose: () => void; // A function to close the panel
}

export default function NewsPanel({ news, onClose }: NewsPanelProps) {
  // Sort the news items by credibility_score in descending order
  const sortedNews = [...news].sort((a, b) => b.credibility_score - a.credibility_score);

  return (
    <div 
      className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
      onMouseLeave={onClose} // This line closes the panel when the mouse leaves
    >
      <div className="bg-gray-800 text-white rounded-lg shadow-xl w-11/12 max-w-md h-3/4 flex flex-col">
        {/* Panel Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-yellow-300">
            News for {news[0]?.city || 'Selected City'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Scrollable News List */}
        <div className="overflow-y-auto p-4 flex-grow">
          {sortedNews.map((item) => (
            <div key={item._id} className="mb-4 p-3 bg-gray-700 rounded-lg">
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{item.summary}</p>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Source: {item.source}</span>
                <span className="font-bold text-green-400">
                  Trust: {item.credibility_score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}