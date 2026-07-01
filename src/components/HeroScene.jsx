import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Center, Html } from "@react-three/drei";
import { Atom, Wind, Braces, Code2 } from "lucide-react";

const ORBIT_RADIUS = 3.5;
const ORBIT_SPEED = 0.2;

// Pure Icon Component (No Text, Large Size, Floating Animation)
function TechIcon({ angleOffset, color, IconComponent }) {
  const meshRef = useRef();

  useFrame((state) => {
    const angle = state.clock.getElapsedTime() * ORBIT_SPEED + angleOffset;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angle) * ORBIT_RADIUS;
      meshRef.current.position.z = Math.sin(angle) * ORBIT_RADIUS;

      // Halka sa natural wavy float effect upar-neche taake organic lage
      meshRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 2 + angleOffset) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Tiny inner guide light core */}
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
      />

      {/* HTML Layer containing only the BIG vector icon */}
      <Html distanceFactor={6} center pointerEvents="none">
        <div
          className="flex items-center justify-center p-3 rounded-full transition-all duration-300 select-none backdrop-blur-sm"
          style={{
            color: color,
            // Custom glowing filter taake pure vector icon par neon chamak aaye
            filter: `drop-shadow(0 0 12px ${color}80) drop-shadow(0 0 25px ${color}40)`,
          }}
        >
          {/* Bigger sizing applied directly to vector markup */}
          <IconComponent size={44} strokeWidth={1.8} />
        </div>
      </Html>
    </mesh>
  );
}

function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[ORBIT_RADIUS, 0.01, 8, 120]} />
      <meshBasicMaterial color="#334155" opacity={0.25} transparent />
    </mesh>
  );
}

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
      count={5000}
      factor={4}
      fade
    />
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-screen bg-slate-950 relative overflow-hidden">
      <Canvas camera={{ position: [0, 4, 7], fov: 60 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />

        <RotatingStars />
        <OrbitRing />

        {/* CENTER NAME DISPLAY */}
        <Center>
          <Html center className="select-none text-center pointer-events-none">
            <div className="flex flex-col items-center justify-center">
              <span className="text-cyan-400 font-mono tracking-widest text-xs uppercase block mb-3 opacity-80">
                Creative Frontend Dev
              </span>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase select-none">
                Ashaan
              </h1>
              <p className="text-slate-600 font-mono text-[9px] mt-2 uppercase tracking-widest">
                Interactive Space System v1.3
              </p>
            </div>
          </Html>
        </Center>

        {/* PURE ORBITING VECTOR ICONS */}
        <TechIcon angleOffset={0} color="#06b6d4" IconComponent={Atom} />
        <TechIcon
          angleOffset={Math.PI / 2}
          color="#38bdf8"
          IconComponent={Wind}
        />
        <TechIcon
          angleOffset={Math.PI}
          color="#facc15"
          IconComponent={Braces}
        />
        <TechIcon
          angleOffset={(3 * Math.PI) / 2}
          color="#f97316"
          IconComponent={Code2}
        />
      </Canvas>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] text-slate-700 tracking-widest uppercase">
        Scroll Down
      </div>
    </div>
  );
}
