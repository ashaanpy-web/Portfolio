import { useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Flame, ArrowUpRight } from "lucide-react";
import { useLiquidGlass } from "../hooks/useLiquidGlass";

/* ═══════════════════════════════════════════════════════════════════
   LIQUID GLASS BENTO CARD
   ═══════════════════════════════════════════════════════════════════
   Each BentoCard gets its own useLiquidGlass() instance so the
   ResizeObserver is correctly scoped per element.
   The outer wrapper div is the motion-animated element (for stagger
   entrance). The inner `glassRef` div is the measured/filtered node.
   border-radius: 24px matches Tailwind `rounded-3xl`.
   ═══════════════════════════════════════════════════════════════════ */

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
};

function BentoCard({
  className = "",
  children,
  accentHover = "cyan",
  glassScale = 16,
  glassChroma = 3,
}) {
  const { ref: glassRef, isNative } = useLiquidGlass({
    scale: glassScale,
    chroma: glassChroma,
    borderRadius: 24, // rounded-3xl = 1.5rem = 24px
    enabled: true,
  });

  const hoverRingMap = {
    cyan: "hover:shadow-[0_0_40px_rgba(6,182,212,0.18)]",
    emerald: "hover:shadow-[0_0_40px_rgba(16,185,129,0.18)]",
    orange: "hover:shadow-[0_0_40px_rgba(249,115,22,0.18)]",
    indigo: "hover:shadow-[0_0_40px_rgba(99,102,241,0.18)]",
  };

  return (
    <motion.div
      variants={cardVariants}
      className={[
        "group relative rounded-3xl",
        "transition-all duration-300 ease-out",
        className,
      ].join(" ")}
    >
      {/* ── GLASS SURFACE — measured and filtered node ─────────────────── */}
      <div
        ref={glassRef}
        className={[
          "bento-card-glow",
          "relative w-full h-full rounded-3xl overflow-hidden",
          "transition-all duration-300",
          hoverRingMap[accentHover] ?? hoverRingMap.cyan,
        ].join(" ")}
        style={{
          // ── Apple-spec glass material dressing ───────────────────────────
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.45), " +
            "inset 0 1px 1px rgba(255,255,255,0.4), " +
            "inset 0 -8px 20px rgba(255,255,255,0.03), " +
            "inset 0 0 0 1px rgba(255,255,255,0.15)",
          // Fallback for non-Chromium browsers
          backdropFilter: isNative ? undefined : "blur(16px) saturate(1.5)",
          WebkitBackdropFilter: isNative
            ? undefined
            : "blur(16px) saturate(1.5)",
        }}
      >
        {/* Chromatic top rim specular */}
        <div
          className="absolute top-0 inset-x-0 h-[1px] pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 40%, rgba(6,182,212,0.5) 60%, transparent 100%)",
          }}
        />

        {/* Inner optical sheen */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse at 30% 15%, rgba(255,255,255,0.05) 0%, transparent 55%)",
          }}
        />

        {/* Light reflection gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] pointer-events-none z-10" />

        {/* Card content */}
        <div className="relative z-20 w-full h-full">{children}</div>

        {/* Bottom chromatic fringe */}
        <div
          className="absolute bottom-0 inset-x-0 h-[1px] pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.3) 40%, rgba(6,182,212,0.25) 60%, transparent 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Tag Chip ───────────────────────────────────────────────────────────── */
function Tag({ label, color = "cyan" }) {
  const colorMap = {
    cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    slate: "text-slate-400 border-slate-500/30 bg-slate-500/10",
    indigo: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  };
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border",
        colorMap[color] ?? colorMap.cyan,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

/* ─── Stat Block ─────────────────────────────────────────────────────────── */
function StatBlock({ value, label, accent = "cyan" }) {
  const accentMap = {
    cyan: "text-cyan-400",
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    orange: "text-orange-400",
  };
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={["text-3xl font-chakra font-bold", accentMap[accent]].join(
          " ",
        )}
      >
        {value}
      </span>
      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AboutBento
   ═══════════════════════════════════════════════════════════════════ */
export default function AboutBento() {
  const gridRef = useRef(null);

  return (
    <section className="relative w-full min-h-screen pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col justify-center min-h-screen">
        {/* Section header */}
        <div className="mb-12">
          <span className="text-cyan-400 tracking-[0.22em] text-xs uppercase font-mono font-semibold block mb-3 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            // SYSTEM SPEC GRID
          </span>
          <h2 className="text-3xl md:text-4xl font-chakra font-bold text-white uppercase tracking-wide">
            Core Architecture
          </h2>
        </div>

        {/* ── BENTO GRID ─────────────────────────────────────────────────── */}
        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-auto font-space"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* ── CARD [01] Philosophy — WIDE ───────────────────────────────── */}
          <BentoCard
            className="md:col-span-2 md:row-span-2"
            accentHover="cyan"
            glassScale={14}
            glassChroma={3}
          >
            <div className="p-8 flex flex-col h-full justify-between min-h-[22rem]">
              <div>
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-70 group-hover:text-cyan-400 transition-all duration-300 z-30">
                  <Terminal size={22} />
                </div>
                <span className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase block mb-3">
                  [01 // Philosophy]
                </span>
                <h3 className="text-2xl md:text-4xl font-chakra font-bold text-white uppercase tracking-wide mb-6 leading-snug">
                  Engineering Digital Ecosystems
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base max-w-2xl">
                  Main interfaces ko design nahi karta, balkay unke algorithms
                  aur responsive systems ko transform karta hon. Meray liye code
                  sirf markup nahi hai—yeh interactive performance, structural
                  pixel-perfection, aur clean structural architecture ka fusion
                  hai.
                </p>
              </div>

              <div className="flex gap-3 flex-wrap mt-8">
                <Tag label="Architecture Driven" color="cyan" />
                <Tag label="UI/UX Mechanics" color="slate" />
                <Tag label="Pixel-Perfect Systems" color="slate" />
              </div>
            </div>
          </BentoCard>

          {/* ── CARD [02] Stack ───────────────────────────────────────────── */}
          <BentoCard accentHover="indigo" glassScale={12} glassChroma={2.5}>
            <div className="p-6 flex flex-col gap-4 min-h-[10rem]">
              <div className="flex items-center gap-2 opacity-50 group-hover:opacity-80 transition-opacity">
                <Cpu size={16} className="text-indigo-400" />
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                  [02 // Stack]
                </span>
              </div>
              <h4 className="text-base font-chakra font-bold text-white uppercase tracking-wider">
                Core Toolset
              </h4>
              <div className="flex flex-wrap gap-2 mt-auto">
                {["React", "Three.js", "Framer Motion", "Tailwind", "Node"].map(
                  (t) => (
                    <Tag key={t} label={t} color="indigo" />
                  ),
                )}
              </div>
            </div>
          </BentoCard>

          {/* ── CARD [03] Metrics ─────────────────────────────────────────── */}
          <BentoCard accentHover="emerald" glassScale={10} glassChroma={2}>
            <div className="p-6 flex flex-col gap-6 min-h-[10rem]">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest opacity-60">
                [03 // Metrics]
              </span>
              <div className="flex gap-6 flex-wrap">
                <StatBlock value="3+" label="Years Active" accent="emerald" />
                <StatBlock value="20+" label="Projects Shipped" accent="cyan" />
              </div>
            </div>
          </BentoCard>

          {/* ── CARD [04] Passion ─────────────────────────────────────────── */}
          <BentoCard
            className="md:col-span-2"
            accentHover="orange"
            glassScale={12}
            glassChroma={3}
          >
            <div className="p-6 flex flex-col justify-between min-h-[10rem]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest opacity-60">
                  [04 // Passion]
                </span>
                <Flame
                  size={16}
                  className="text-orange-400 opacity-40 group-hover:opacity-80 transition-opacity"
                />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mt-4">
                Hardware diagnostics, custom firmware, performance tuning —
                where software meets the silicon. Every pixel and every clock
                cycle is intentional.
              </p>
              <div className="flex gap-3 flex-wrap mt-5">
                <Tag label="Embedded Systems" color="slate" />
                <Tag label="Hardware Mods" color="slate" />
                <Tag label="60fps Everything" color="cyan" />
              </div>
            </div>
          </BentoCard>

          {/* ── CARD [05] CTA ─────────────────────────────────────────────── */}
          <BentoCard accentHover="cyan" glassScale={14} glassChroma={4}>
            <div className="p-6 flex flex-col justify-between min-h-[10rem] h-full">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest opacity-60">
                [05 // Contact]
              </span>
              <div className="mt-auto">
                <h4 className="text-lg font-chakra font-bold text-white uppercase tracking-wider mb-4">
                  Let's Build Together
                </h4>
                <button className="group/btn flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono uppercase tracking-widest px-4 py-2.5 rounded-full hover:bg-cyan-500/20 transition-all duration-200">
                  <span>Open Link</span>
                  <ArrowUpRight
                    size={12}
                    className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                  />
                </button>
              </div>
            </div>
          </BentoCard>
        </motion.div>
      </div>
    </section>
  );
}
