import { useScroll, useTransform, useSpring, motion } from "framer-motion";
import { useDevicePerf } from "./hooks/useDevicePerf";
import SpaceBG from "./components/SpaceBG";
import OrbitSystem from "./components/OrbitSystem";
import AboutCard from "./components/AboutCard";
import AboutBento from "./components/AboutBento";
import TechConveyorBelt from "./components/TechConveyorBelt";
import ProjectsShowcase from "./components/ProjectsShowcase";
import "./index.css";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  App.jsx — Global Layout Orchestrator                            ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  Z-INDEX LAYER STACK                                             ║
 * ║  z-0  → SpaceBG          Fixed starfield Three.js canvas        ║
 * ║  z-10 → Glow Phase 1     Dark/transparent — hero phase          ║
 * ║  z-11 → Glow Phase 2     Cyan + indigo cyber-matrix glow        ║
 * ║  z-12 → Glow Phase 3     Deep velvet-purple ambient overlay     ║
 * ║  z-20 → Hero (sticky)    OrbitSystem — pinned, scales out       ║
 * ║  z-30 → AboutBento       Slides physically UP over hero         ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  STICKY ARCHITECTURE                                             ║
 * ║  The hero is `sticky top-0 h-screen` inside a scroll-track      ║
 * ║  wrapper. As the user scrolls, the hero stays pinned while       ║
 * ║  AboutBento (z-30) physically slides up over it. The hero        ║
 * ║  simultaneously scales from 1→0.9 and fades 1→0 via             ║
 * ║  useTransform on scrollYProgress — creating the "Makhan"         ║
 * ║  Apple-style layer peel effect.                                  ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  3-PHASE GRADIENT PIPELINE                                       ║
 * ║  Three separate fixed div layers each with independently         ║
 * ║  controlled opacity MotionValues. Framer Motion interpolates     ║
 * ║  opacity only (a composited CSS property) — zero main-thread     ║
 * ║  blocking, zero React re-renders, zero gradient string parsing   ║
 * ║  per frame. Pure GPU compositor path.                            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
export default function App() {
  const { lowEnd, reduceMotion } = useDevicePerf();
  const showGlow = !lowEnd;

  // ── Raw scroll progress across entire document (0 → 1) ──────────
  const { scrollYProgress } = useScroll();

  // ── Spring: converts raw scroll into smooth, damped motion ───────
  //    stiffness/damping tuned for silky 60fps feel without overshoot
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    restDelta: 0.0005,
  });

  // ────────────────────────────────────────────────────────────────
  // HERO TRANSFORMS — applied to the sticky hero inner wrapper
  // The sticky *container* itself doesn't transform (layout must stay
  // pinned). Only the inner canvas wrapper scale/fades.
  // ────────────────────────────────────────────────────────────────

  // Hero opacity: fully visible → invisible as Bento slides over
  const heroOpacity = useTransform(smooth, [0, 0.4], [1, 0]);

  // Hero scale: subtle pullback gives depth illusion (1 → 0.9)
  const heroScale = useTransform(smooth, [0, 0.4], [1, 0.9]);

  // ────────────────────────────────────────────────────────────────
  // 3-PHASE GRADIENT OPACITY PIPELINE
  // Each phase is a separate fixed div with its own gradient string.
  // Framer Motion drives ONLY opacity — the cheapest GPU operation.
  // No string interpolation, no JS color math per frame.
  // ────────────────────────────────────────────────────────────────

  // Phase 1 opacity: visible at top, fades as user leaves hero
  // (Technically transparent — just keeping it here for completeness)
  const phase1Opacity = useTransform(smooth, [0, 0.15], [0, 0]);

  // Phase 2 opacity: Cyan/Indigo cyber-matrix — peaks mid-scroll
  // Rises from 0 at 15% scroll → peaks at 0.55% → falls back at 85%
  const phase2Opacity = useTransform(
    smooth,
    [0.12, 0.3, 0.65, 0.85],
    [0, 1, 1, 0],
  );

  // Phase 3 opacity: Velvet purple — takes over in deep scroll
  // Rises from 0 at 65% scroll → peaks and stays through end
  const phase3Opacity = useTransform(smooth, [0.6, 0.82], [0, 1]);

  return (
    /*
     * Root wrapper: position relative, full width, dark base color.
     * No overflow-hidden here — the scroll must propagate naturally.
     */
    <div className="relative w-full font-space bg-transparent">
      {/* ══════════════════════════════════════════════════════════
          LAYER 0 — SpaceBG
          Fixed, full-viewport Three.js starfield. Stays behind
          everything at z-0. pointer-events-none always.
          ══════════════════════════════════════════════════════════ */}
      <SpaceBG />

      {/* ══════════════════════════════════════════════════════════
          LAYER 1-3 — MULTI-PHASE GRADIENT PIPELINE
          Three independently opacity-animated fixed divs.
          All three are always mounted; only opacity changes.
          will-change: opacity → GPU compositor layer each.
          ══════════════════════════════════════════════════════════ */}


        className="glow-overlay fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 11,
          opacity: phase2Opacity,
          background:
            "radial-gradient(circle at 50% 60%, rgba(99, 102, 241, 0.16) 0%, rgba(6, 182, 212, 0.06) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Phase 3: Deep velvet-slate shadow — takes over in deep scroll */}
        className="glow-overlay fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 12,
          opacity: phase3Opacity,
          background:
            "radial-gradient(circle at 50% 80%, rgba(15, 23, 42, 0.7) 0%, rgba(2, 6, 23, 0.9) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════
          LAYER 2 — STICKY HERO
          ─────────────────────────────────────────────────────────
          The outer `sticky` div is the layout anchor — it MUST NOT
          have any transforms applied directly or sticky breaks.
          The inner `motion.div` receives scale + opacity transforms.

          sticky top-0 h-screen → pinned to viewport top, full height
          overflow-hidden       → clips the canvas during scale-down
          z-20                  → sits above glow layers, below Bento
          pointer-events-none   → canvas clicks pass through
          ══════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden pointer-events-none"
        style={{ zIndex: 20 }}
        aria-label="Hero orbit system"
      >
        {/* Inner wrapper receives the scale + fade transforms */}
        <motion.div
          className="hero-layer absolute inset-0 w-full h-full"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            transformOrigin: "center center",
          }}
        >
          <OrbitSystem lowEnd={lowEnd || reduceMotion} />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          LAYER 3 — ABOUT BENTO
          ─────────────────────────────────────────────────────────
          AboutBento sits in natural document flow AFTER the sticky
          hero. Because the hero is sticky (not fixed), the document
          flow continues below it — Bento scrolls up naturally from
          below the viewport and slides OVER the pinned hero.

          -mt-screen (negative top margin) is NOT needed because
          the sticky hero already occupies the viewport top; Bento
          simply starts in the next scroll position in the document.

          z-30: renders above the sticky hero during overlap.
          bg-slate-950/70 backdrop-blur-2xl: premium glass surface.
          pointer-events-auto: fully interactive — buttons, text selection.
          ══════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full pointer-events-auto"
        style={{ zIndex: 30 }}
      >
        {/* The solid dark glass surface backdrop has been removed to allow the SpaceBG to render natively through the entire scroll flow. */}

        {/* Actual bento content sits above the backdrop */}
        <div className="relative">
          <AboutCard />
          <AboutBento />
          <TechConveyorBelt />
          <ProjectsShowcase />
        </div>
      </div>
    </div>
  );
}
