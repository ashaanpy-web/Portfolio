import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useDevicePerf } from "../hooks/useDevicePerf";

/**
 * RotatingStars
 * GPU-side Y-axis rotation via useFrame clock — zero JS overhead.
 * Ref directly mutates Three.js object without triggering React re-renders.
 */
function RotatingStars({ count = 1200 }) {
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
      count={count}
      factor={3.2}
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
  const { lowEnd, reduceMotion } = useDevicePerf();
  const lightMode = lowEnd || reduceMotion;
  const starCount = 1200;

  if (lightMode) {
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.18), transparent 22%), " +
            "radial-gradient(circle at 80% 15%, rgba(99,102,241,0.14), transparent 18%), " +
            "radial-gradient(circle at 50% 85%, rgba(15,23,42,0.75), transparent 35%), " +
            "#020617",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
        }}
        dpr={[1, 1.25]}
      >
        <ambientLight intensity={0.8} />
        <Suspense fallback={null}>
          <RotatingStars count={starCount} />
        </Suspense>
      </Canvas>
    </div>
  );
}
