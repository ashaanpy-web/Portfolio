import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

/**
 * RotatingStars
 * GPU-side Y-axis rotation via useFrame clock — zero JS overhead.
 * Ref directly mutates Three.js object without triggering React re-renders.
 */
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
      radius={120}
      depth={60}
      count={5000}
      factor={4}
      saturation={0}
      fade
      speed={0}
    />
  );
}

/**
 * SpaceBG
 * Layer 0 — Fixed, full-viewport canvas behind everything.
 * pointer-events-none so all clicks pass through.
 */
export default function SpaceBG() {
  return (
    <div
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{
          antialias: false,       // Perf: off for bg canvas
          powerPreference: "high-performance",
          alpha: false,
        }}
        dpr={[1, 1.5]}           // Cap DPR for perf
      >
        <ambientLight intensity={0.8} />
        <Suspense fallback={null}>
          <RotatingStars />
        </Suspense>
      </Canvas>
    </div>
  );
}
