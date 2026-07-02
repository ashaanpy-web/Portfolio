import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

function RotatingStars() {
  const starsRef = useRef();
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.005;
    }
  });
  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={50}
      count={2000}
      factor={4}
      fade
    />
  );
}

// 3D Nebula Ambient Glow Solution
function SpaceNebulaGlow() {
  return (
    <group position={[0, -5, -2]}>
      {" "}
      {/* Scroll position ke mutabiq neche center kiya */}
      {/* 1. Core Cyan Glow Source */}
      <pointLight distance={15} intensity={8} color="#06b6d4" />
      {/* 2. Soft Purple Ambient Scatter */}
      <pointLight distance={20} intensity={6} color="#6366f1" />
      {/* Visual representation taake background par heavy smooth gradient spread ho */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.06}
          wireframe={false}
        />
      </mesh>
    </group>
  );
}

export default function SpaceBG() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-slate-950">
      <Canvas camera={{ position: [0, 4, 7], fov: 60 }}>
        <ambientLight intensity={1.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <Suspense fallback={null}>
          <RotatingStars />
          {/* Dynamic real 3D ambient space light source injected */}
          <SpaceNebulaGlow />
        </Suspense>
      </Canvas>
    </div>
  );
}
