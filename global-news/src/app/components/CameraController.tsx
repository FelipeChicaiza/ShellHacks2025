"use client";

import { useThree, useFrame } from "@react-three/fiber";

export default function CameraController({ target }) {
  const { camera } = useThree();
  useFrame(() => {
    if (target) {
      camera.position.lerp(target, 0.05);
      camera.lookAt(0, 0, 0);
    }
  });
  return null;
}
