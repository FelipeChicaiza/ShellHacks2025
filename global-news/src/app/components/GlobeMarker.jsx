import React, { useState, useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// Convert latitude & longitude into 3D coords utility
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

// Smooth camera movement utility
export function CameraController({ target }) {
  const { camera } = useThree();
  useFrame(() => {
    if (target) {
      // Lerp (smooth interpolation) camera position towards target
      camera.position.lerp(target, 0.05);
      camera.lookAt(0, 0, 0);
    }
  });
  return null;
}

// 📍 Clickable, Pulsing Marker
export function Marker({ newsItem, onMarkerClick }) {
  
  // --- GUARD CLAUSE TO PREVENT TYPEERROR ---
  if (!newsItem || typeof newsItem.lat !== 'number' || typeof newsItem.lon !== 'number') {
    return null; // Don't render the marker if coordinates are missing or invalid
  }
  // ----------------------------------------

  const [hovered, setHovered] = useState(false);
  // Using 2.52 to lift the marker slightly off the radius 2.5 Earth
  const pos = latLonToVector3(newsItem.lat, newsItem.lon, 2.52);
  const innerRef = useRef(null);
  

  useFrame(({ clock }) => {
    // Pulse animation for the marker's size
    const scale = 1 + Math.sin(clock.elapsedTime * 5) * 0.2;
    if (innerRef.current) {
        innerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={pos} onClick={() => onMarkerClick(newsItem)}>
      {/* Invisible hover area around the marker */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* The pulsing inner dot */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#facc15" /> {/* Yellow marker */}
      </mesh>

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
