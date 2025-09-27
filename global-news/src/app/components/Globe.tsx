"use client"

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef } from "react"
import * as THREE from "three"

export default function Globe(){
    return(
       <div className="w-full h-[850px]">
      <Canvas camera={{ position: [0, 0, 3] }}>
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={1} />

        {/* Earth (simple sphere for now) */}
        <mesh>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial color="#1E90FF" />
        </mesh>

        {/* Controls: allows user to rotate/zoom */}
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
    );
}