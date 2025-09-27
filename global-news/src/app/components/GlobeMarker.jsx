import React, { useState, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// Utility function to convert lat/lon to 3D coordinates
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

export function CameraController({ target }) {
  const { camera } = useThree();
  useFrame(() => {
    if (target) {
      camera.position.lerp(target, 0.05);
      camera.lookAt(0, 0, 0);
    }
  });
  return null;
}

// The Marker (Pin) Component
export function Marker({ newsItem, onMarkerClick }) {
  
  // --- THIS IS THE UPDATED LOGIC ---
  // It checks for coordinates in both possible structures
  const lat = newsItem?.geotag?.lat ?? newsItem?.lat;
  const lon = newsItem?.geotag?.lng ?? newsItem?.lon; // Note: checks for 'lng' first
  
  // Guard clause to prevent errors if data is incomplete
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return null; // Don't render if coordinates are not found
  }

  const [hovered, setHovered] = useState(false);
  // Uses the extracted lat and lon to calculate the 3D position
  const pos = latLonToVector3(lat, lon, 2.52);
  const innerRef = useRef(null);
  
  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.elapsedTime * 5) * 0.2;
    if (innerRef.current) {
        innerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={pos} onClick={() => onMarkerClick(lat, lon)}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>

      {/* Uses the title from the newsItem prop for the hover label */}
      {hovered && (
        <Html distanceFactor={10} position={[0.1, 0, 0]}>
            <div className="bg-gray-900 text-yellow-300 px-2 py-1 rounded text-xs shadow-lg font-mono whitespace-nowrap">
              {newsItem.title.substring(0, 30)}...
            </div>
          </Html>
      )}
    </group>
  );
}