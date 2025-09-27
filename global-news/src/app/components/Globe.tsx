"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";


import { Earth, Atmosphere } from './GlobePrimitives';
import { Marker, CameraController } from './GlobeMarker';
import NewsPanel from './NewsPanel';

// (latLonToVector3 function remains the same)
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

export default function Globe() {
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const [allNewsData, setAllNewsData] = useState([]);
  const [hoveredCityNews, setHoveredCityNews] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const API_URL = "http://localhost:5001/api/news";
    fetch(API_URL)
      .then(response => response.json())
      .then(apiResponse => {
        if (apiResponse.success) {
          setAllNewsData(apiResponse.data);
        }
      })
      .catch(error => console.error("Error fetching news data:", error));
  }, []);

  // --- NEW HOVER HANDLERS ---
  const handleMarkerHover = useCallback((hoveredItem) => {
    const cityNews = allNewsData.filter(
      (item) => item.city.toLowerCase() === hoveredItem.city.toLowerCase()
    );
    setHoveredCityNews(cityNews);
    setIsPanelOpen(true);

    const { lat, lng } = hoveredItem.geotag;
    const [x, y, z] = latLonToVector3(lat, lng, 5.0);
    setTarget(new THREE.Vector3(x, y, z));
  }, [allNewsData]);

  const handleMarkerLeave = () => {
    setIsPanelOpen(false);
    setHoveredCityNews([]);
    // Optional: Reset camera target when not hovering
    // setTarget(null); 
  };
  // -------------------------

  return (
    <div className="w-full h-[850px] relative">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Stars />
        <Earth />
        <Atmosphere />
        
        {allNewsData.map((item) => (
          <Marker
            key={item._id}
            newsItem={item}
            onPointerOver={handleMarkerHover}
            onPointerOut={handleMarkerLeave}
          />
        ))}

        <OrbitControls enableZoom={Boolean(target)} />
        <CameraController target={target} />
      </Canvas>

      {isPanelOpen && (
        <NewsPanel 
          news={hoveredCityNews} 
          onClose={handleMarkerLeave} 
        />
      )}
    </div>
  );
}