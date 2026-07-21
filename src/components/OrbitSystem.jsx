import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { useDevicePerf } from "../hooks/useDevicePerf";
import { premiumViewportVariants } from "../utils/animations";
import {
  Atom,
  Server,
  Wind,
  Clapperboard,
  Braces,
  GitBranch,
  Code2,
  Layers,
} from "lucide-react";

/* ── Constants ─────────────────────────────────────────────────── */
const ORBIT_RADIUS = 3.6;
const ORBIT_SPEED = 0.28;

const ICON_MAP = [
  { Icon: Atom, color: "#06b6d4", step: 0 },
  { Icon: Server, color: "#4ade80", step: 1 },
  { Icon: Wind, color: "#38bdf8", step: 2 },
  { Icon: Clapperboard, color: "#a855f7", step: 3 },
  { Icon: Braces, color: "#facc15", step: 4 },
  { Icon: GitBranch, color: "#e2e8f0", step: 5 },
  { Icon: Code2, color: "#f97316", step: 6 },
  { Icon: Layers, color: "#ec4899", step: 7 },
];

const ANGLE_STEP = (Math.PI * 2) / ICON_MAP.length; // Exactly 2π/8

/* ── Orbit Ring (static torus) ─────────────────────────────────── */
function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[ORBIT_RADIUS, 0.007, 8, 128]} />
      <meshBasicMaterial color="#334155" opacity={0.25} transparent />
    </mesh>
  );
}

/* ── Individual Tech Icon Node ─────────────────────────────────── */
function TechIcon({ angleOffset, color, Icon }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const angle = t * ORBIT_SPEED + angleOffset;
    // Precise Math.cos / Math.sin orbit path
    meshRef.current.position.x = Math.cos(angle) * ORBIT_RADIUS;
    meshRef.current.position.z = Math.sin(angle) * ORBIT_RADIUS;
    // Subtle vertical breathing
    meshRef.current.position.y = Math.sin(t * 1.8 + angleOffset) * 0.12;
  });

  return (
    <mesh ref={meshRef}>
      {/* Tiny invisible anchor sphere — geometry needed for Html distanceFactor */}
      <sphereGeometry args={[0.025, 6, 6]} />
      <meshBasicMaterial transparent opacity={0} />
      <Html distanceFactor={6} center>
        <div
          className="flex items-center justify-center select-none pointer-events-none"
          style={{
            color,
            filter: `drop-shadow(0 0 12px ${color}99) drop-shadow(0 0 28px ${color}44)`,
          }}
        >
          <Icon size={44} strokeWidth={1.6} />
        </div>
      </Html>
    </mesh>
  );
}

/* ── Center Hero Text (R3F Html overlay) ───────────────────────── */
function HeroCenterText() {
  return (
    <Html center className="select-none pointer-events-none">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Eyebrow label */}
        <span
          className="font-space font-semibold uppercase text-cyan-400"
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.28em",
            display: "block",
            marginBottom: "0.75rem",
            opacity: 0.9,
          }}
        >
          Creative Frontend Dev
        </span>

        {/* Main H1 — Chakra Petch Cyberpunk */}
        <h1
          className="font-chakra font-bold uppercase text-white"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 6.5rem)",
            letterSpacing: "0.1em",
            lineHeight: 1,
            whiteSpace: "nowrap",
            textShadow:
              "0 0 40px rgba(255,255,255,0.12), 0 0 80px rgba(6,182,212,0.08)",
          }}
        >
          ASHAAN
        </h1>

        {/* System sub-label */}
        <p
          className="font-space"
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.32em",
            color: "#475569",
            marginTop: "0.85rem",
            textTransform: "uppercase",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Component System V2.2
        </p>
      </div>
    </Html>
  );
}

/* ── OrbitSystem Export ─────────────────────────────────────────── */
/**
 * Layer 2 — Hero Canvas Overlay.
 * Positioned absolute inside its parent scroll-linked wrapper.
 * pointer-events-none: all click events pass to underlying elements.
 */
export default function OrbitSystem({ lowEnd = false }) {
  const { prefersReducedMotion } = useDevicePerf();
  const disableAnimation = lowEnd || prefersReducedMotion;

  if (disableAnimation) {
    return (
      <motion.section
        variants={premiumViewportVariants}
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true }}
        className="absolute inset-0 w-full h-full pointer-events-none hero-layer"
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="font-space font-semibold uppercase text-cyan-400 tracking-[0.28em] text-[0.65rem] mb-4">
            Creative Frontend Dev
          </span>
          <h1
            className="font-chakra font-bold uppercase text-white"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 6.5rem)",
              letterSpacing: "0.1em",
              lineHeight: 1,
            }}
          >
            ASHAAN
          </h1>
          <p className="mt-4 text-slate-400 uppercase tracking-[0.32em] text-[0.55rem]">
            Component System V2.2
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      variants={premiumViewportVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true }}
      className="absolute inset-0 w-full h-full pointer-events-none hero-layer"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 3.5, 7.5], fov: 58 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.4} />
        <pointLight position={[0, 5, 5]} intensity={0.55} color="#06b6d4" />

        {/* Static orbit ring */}
        <OrbitRing />

        {/* Center hero name / text */}
        <HeroCenterText />

        {/* 8 Orbiting tech icons — evenly spaced by (2π/8) */}
        {ICON_MAP.map(({ Icon, color, step }) => (
          <TechIcon
            key={step}
            angleOffset={ANGLE_STEP * step}
            color={color}
            Icon={Icon}
          />
        ))}
      </Canvas>
    </motion.section>
  );
}
