"use client"

import React, {useState, useCallback} from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

// --- ACTUAL IMPORTS FROM SEPARATED FILES ---
// NOTE: Please ensure the relative paths below match your local file structure 
// (e.g., if you moved them to 'src/app/components/', the path might be './GlobePrimitives').
import { Earth, Atmosphere } from './GlobePrimitives'; 
import { Marker, CameraController } from './GlobeMarker';

// Convert latitude & longitude into 3D coords utility
// This function remains here because the Globe component directly uses it 
// to calculate the camera target in handleMarkerClick.
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

  // In a real app, this data would come from your main App state
  const mockNewsData = [
    { name: "Miami News", lat: 25.7617, lon: -80.1918 },
    { name: "New York Report", lat: 40.7128, lon: -74.006 },
    { name: "London Headline", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo Event", lat: 35.6895, lon: 139.6917 },
  ];

  const handleMarkerClick = useCallback((lat: number, lon: number) => {
    // 5.0 is the target distance from the center of the globe
    const [x, y, z] = latLonToVector3(lat, lon, 5.0); 
    setTarget(new THREE.Vector3(x, y, z));
  }, []);

  return (
    <div className="w-full h-[850px]">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.5} />
        {/* Directional light to simulate the sun */}
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        
        {/* A starfield background */}
        <Stars />

        {/* The Earth (Imported from GlobePrimitives) */}
        <Earth />

        {/* The atmosphere effect (Imported from GlobePrimitives) */}
        <Atmosphere />

        {/* Markers (Imported from GlobeMarker) */}
        {mockNewsData.map((m, i) => (
          <Marker
            key={i}
            name={m.name}
            lat={m.lat}
            lon={m.lon}
            onClick={() => handleMarkerClick(m.lat, m.lon)}
          />
        ))}

        <OrbitControls enableZoom={Boolean(target)} />
        {/* Camera Controller (Imported from GlobeMarker) */}
        <CameraController target={target} />
      </Canvas>
    </div>
  );
}
