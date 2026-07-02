import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Html } from "@react-three/drei";
import {
  Atom,
  Wind,
  Braces,
  Code2,
  GitBranch,
  Server,
  Clapperboard,
  Layers,
} from "lucide-react";

const ORBIT_RADIUS = 3.8;
const ORBIT_SPEED = 0.35;

function TechIcon({ angleOffset, color, IconComponent }) {
  const meshRef = useRef();

  useFrame((state) => {
    const angle = state.clock.getElapsedTime() * ORBIT_SPEED + angleOffset;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angle) * ORBIT_RADIUS;
      meshRef.current.position.z = Math.sin(angle) * ORBIT_RADIUS;
      meshRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 2 + angleOffset) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
      />
      <Html distanceFactor={6} center pointerEvents="none">
        <div
          className="flex items-center justify-center p-4 rounded-full select-none"
          style={{
            color: color,
            filter: `drop-shadow(0 0 15px ${color}90) drop-shadow(0 0 30px ${color}50)`,
          }}
        >
          <IconComponent size={48} strokeWidth={1.8} />
        </div>
      </Html>
    </mesh>
  );
}

function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[ORBIT_RADIUS, 0.008, 8, 120]} />
      <meshBasicMaterial color="#334155" opacity={0.2} transparent />
    </mesh>
  );
}

export default function OrbitSystem() {
  const step = Math.PI / 4;

  return (
    /* FIXED position matrix applied to prevent background canvas overflow blocking */
    <div className="fixed inset-0 w-full h-screen z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 4, 7], fov: 60 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.5} />
        <OrbitRing />

        <Center>
          <Html center className="select-none text-center pointer-events-none">
            <div className="flex flex-col items-center justify-center">
              <span className="text-cyan-400 font-space tracking-[0.25em] text-xs uppercase block mb-3 opacity-90 font-semibold">
                Creative Frontend Dev
              </span>
              <h1 className="text-6xl md:text-8xl font-chakra font-bold tracking-wider text-white uppercase select-none drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                Ashaan
              </h1>
              <p className="text-slate-600 font-mono text-[9px] mt-3 uppercase tracking-[0.3em]">
                Component System v2.2
              </p>
            </div>
          </Html>
        </Center>

        <TechIcon angleOffset={step * 0} color="#06b6d4" IconComponent={Atom} />
        <TechIcon
          angleOffset={step * 1}
          color="#4ade80"
          IconComponent={Server}
        />
        <TechIcon angleOffset={step * 2} color="#38bdf8" IconComponent={Wind} />
        <TechIcon
          angleOffset={step * 3}
          color="#a855f7"
          IconComponent={Clapperboard}
        />
        <TechIcon
          angleOffset={step * 4}
          color="#facc15"
          IconComponent={Braces}
        />
        <TechIcon
          angleOffset={step * 5}
          color="#ffffff"
          IconComponent={GitBranch}
        />
        <TechIcon
          angleOffset={step * 6}
          color="#f97316"
          IconComponent={Code2}
        />
        <TechIcon
          angleOffset={step * 7}
          color="#ec4899"
          IconComponent={Layers}
        />
      </Canvas>
    </div>
  );
}
