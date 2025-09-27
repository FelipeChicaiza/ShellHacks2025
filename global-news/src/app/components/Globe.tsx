"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

import { Earth, Atmosphere } from './GlobePrimitives';
import { Marker, CameraController } from './GlobeMarker';

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

// --- MAIN GLOBE SCENE COMPONENT ---


export default function Globe() {
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const [newsData, setNewsData] = useState([]); // State to hold data from the API

  //fetch data when the component mounts
  useEffect(() => {

    // --- IMPORTANT ---

    // los peleles tiene que cambiar esto al verdadero API
    const API_URL = "http://localhost:8000/api/news";

    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setNewsData(data);
      })
      .catch(error => console.error("Error fetching news data:", error));
  }, []); // The empty array ensures this runs only once

  const handleMarkerClick = useCallback((lat: number, lon: number) => {
    const [x, y, z] = latLonToVector3(lat, lon, 5.0);
    setTarget(new THREE.Vector3(x, y, z));
  }, []);

  return (
    <div className="w-full h-[850px]">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Stars />
        <Earth />
        <Atmosphere />

        {/* Map over the newsData from the API instead of mock data */}
        {newsData.map((item, i) => (
          <Marker
            key={i}
            newsItem={item} // Pass the whole item to the Marker
            onMarkerClick={() => handleMarkerClick(item.lat, item.lon)}
          />
        ))}

        <OrbitControls enableZoom={Boolean(target)} />
        <CameraController target={target} />
      </Canvas>
    </div>
  );
}