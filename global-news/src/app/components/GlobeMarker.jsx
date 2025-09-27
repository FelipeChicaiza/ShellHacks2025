import React, { useRef } from 'react';
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// (latLonToVector3 and CameraController functions remain the same)
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

// --- UPDATED MARKER COMPONENT ---
export function Marker({ newsItem, onPointerOver, onPointerOut }) {
  const lat = newsItem?.geotag?.lat ?? newsItem?.lat;
  const lon = newsItem?.geotag?.lng ?? newsItem?.lon;
  
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return null;
  }

  const pos = latLonToVector3(lat, lon, 2.52);
  const innerRef = useRef(null);
  
  useFrame(({ clock }) => {
    const scale = 1 + Math.sin(clock.elapsedTime * 5) * 0.2;
    if (innerRef.current) {
        innerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    // The group now uses onPointerOver and onPointerOut
    <group 
      position={pos} 
      onPointerOver={(e) => {
        e.stopPropagation(); // Prevents other objects from being hovered
        onPointerOver(newsItem);
      }}
      onPointerOut={onPointerOut}
    >
      {/* Invisible hover area - increased from 0.1 to 0.07 for a better feel */}
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Visible yellow pin - increased from 0.03 to 0.05 */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="rgba(253, 216, 66, 1)" />
      </mesh>
    </group>
  );
}