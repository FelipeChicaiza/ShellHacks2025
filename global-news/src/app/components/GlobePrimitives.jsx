import React from 'react';
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { AdditiveBlending } from 'three';

// 🌍 Earth Component

export function Earth() {
  // Use useLoader to load the texture from the public folder
  // NOTE: Ensure '/textures/earth_day.png' exists in your public directory.
  const dayTexture = useLoader(THREE.TextureLoader, "/textures/earth_day.png");
  
  return (
    <mesh rotation={[0, 0.4, 0]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      {/* MeshStandardMaterial reacts strongly to light, giving it a realistic look */}
      <meshStandardMaterial 
        map={dayTexture} // The loaded texture
        metallicity={0.4} // Adds slight metallic sheen
        roughness={0.7} // Controls surface texture
      />
    </mesh>
  );
}

// ✨ Glowing Atmosphere Effect

export function Atmosphere() {
    return (
        <mesh scale={[2.6, 2.6, 2.6]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial 
                color="#00aaff" 
                transparent 
                opacity={0.15} 
                depthWrite={false} 
                blending={THREE.AdditiveBlending} // Use additive blending for a glow effect
            />
        </mesh>
    );
}
