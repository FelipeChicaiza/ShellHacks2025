"use client"

import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from "three";

// Convert latitude & longitude into 3D coords
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

// Smooth camera movement
function CameraController({ target }: { target: THREE.Vector3 | null }) {
  const { camera } = useThree();
  useFrame(() => {
    if (target) {
      camera.position.lerp(target, 0.05);
      camera.lookAt(0, 0, 0);
    }
  });
  return null;
}

// 🌍 Earth with day texture only (now reacts to lighting)
function Earth() {
  const dayTexture = useLoader(THREE.TextureLoader, "/textures/earth_day.png");

  return (
    <mesh>
      <sphereGeometry args={[2.5, 64, 64]} />
      {/* Use a Standard Material to react to light */}
      <meshStandardMaterial map={dayTexture} metalness={0.4} roughness={0.7} />
    </mesh>
  );
}

// 📍 Clickable marker with a pulsing effect and tooltip
function Marker({ name, lat, lon, onClick }: { name: string; lat: number; lon: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const pos = latLonToVector3(lat, lon, 2.52);

  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    // Pulse animation for the marker's size
    const scale = 1 + Math.sin(clock.elapsedTime * 5) * 0.2;
    if (innerRef.current) {
        innerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={pos} onClick={onClick}>
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
        <meshBasicMaterial color="yellow" />
      </mesh>

      {hovered && (
        <Html distanceFactor={10} position={[0.1, 0, 0]}>
            <div className="bg-black text-white px-2 py-1 rounded text-xs shadow-lg">
              {name}
            </div>
          </Html>
      )}
    </group>
  );
}

// ✨ Glowing atmosphere effect
function Atmosphere() {
    return (
        <mesh scale={[2.6, 2.6, 2.6]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial color="rgba(0, 170, 255, 1)" transparent opacity={0.20} />
        </mesh>
    );
}

export default function Globe() {
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);

  const markers = [
    { name: "Miami", lat: 25.7617, lon: -80.1918 },
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
  ];

  const handleMarkerClick = (lat: number, lon: number) => {
    const [x, y, z] = latLonToVector3(lat, lon, 5.0);
    setTarget(new THREE.Vector3(x, y, z));
  };

  return (
    <div className="w-full h-[850px]">
      <Canvas camera={{ position: [0, 0, 7] }}>
        <ambientLight intensity={0.5} />
        {/* Directional light to simulate the sun */}
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        
        {/* A starfield background */}
        <Stars />

        {/* The Earth */}
        <Earth />

        {/* The atmosphere effect */}
        <Atmosphere />

        {/* Markers */}
        {markers.map((m, i) => (
          <Marker
            key={i}
            name={m.name}
            lat={m.lat}
            lon={m.lon}
            onClick={() => handleMarkerClick(m.lat, m.lon)}
          />
        ))}

        <OrbitControls enableZoom={Boolean(target)} />
        <CameraController target={target} />
      </Canvas>
    </div>
  );
}