import React from 'react';
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

// 🌍 Earth Component
export function Earth() {
  const dayTexture = useLoader(THREE.TextureLoader, "/textures/earth_day.png");
  
  // The 'rotation' prop has been removed from this mesh
  return (
    <mesh> 
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial 
        map={dayTexture}
        metalness={0.4} // Corrected prop name from 'metallicity'
        roughness={0.7}
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
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}