import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Terminal, Cpu, Flame, ArrowUpRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   Shared stagger entrance for grid cards — each card animates in
   with a Y lift + opacity fade as the Bento surface scrolls into view.
   ═══════════════════════════════════════════════════════════════════ */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ═══════════════════════════════════════════════════════════════════
   BentoCard — Shared glassmorphism card shell
   ═══════════════════════════════════════════════════════════════════ */
function BentoCard({ className = "", children, accentHover = "cyan" }) {
  const hoverBorderMap = {
    cyan:    "hover:border-cyan-500/40",
    emerald: "hover:border-emerald-500/40",
    orange:  "hover:border-orange-500/40",
    indigo:  "hover:border-indigo-500/40",
  };

  return (
    <motion.div
      variants={cardVariants}
      className={[
        "bento-card-glow",
        "group relative rounded-3xl overflow-hidden",
        /* Inner glass: slightly lighter than the App backdrop */
        "bg-slate-900/50 border border-slate-700/40 backdrop-blur-sm",
        "shadow-[inset_0_1px_0px_rgba(255,255,255,0.06),0_4px_32px_rgba(0,0,0,0.4)]",
        "transition-all duration-300 ease-out",
        hoverBorderMap[accentHover] ?? "hover:border-cyan-500/40",
        className,
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Tag — Small monospace badge
   ═══════════════════════════════════════════════════════════════════ */
function Tag({ label, color = "cyan" }) {
  const colorMap = {
    cyan:    "bg-cyan-950/40 text-cyan-400 border-cyan-800/40",
    slate:   "bg-slate-800/60 text-slate-400 border-slate-700/50",
    emerald: "bg-emerald-950/40 text-emerald-400 border-emerald-800/40",
    orange:  "bg-orange-950/40 text-orange-400 border-orange-800/40",
  };
  return (
    <span
      className={[
        "text-[11px] font-mono border px-3 py-1 rounded-md",
        colorMap[color] ?? colorMap.cyan,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AboutBento — Main Export
   ═══════════════════════════════════════════════════════════════════
   This component is the "physical surface" that slides over the hero.
   Its entrance animation (the upward-slide overlap) is orchestrated
   entirely by the App.jsx sticky layout — no useScroll needed here.

   Instead, this component uses IntersectionObserver-style scroll
   (useScroll offset "start end") only to trigger the stagger-in
   animation for the individual grid cards once they enter viewport.

   pointer-events-auto throughout: all cards, buttons, text are
   fully selectable and clickable.
   ═══════════════════════════════════════════════════════════════════ */
export default function AboutBento() {
  const gridRef = useRef(null);

  // Trigger the stagger animation once the grid enters the viewport
  const { scrollYProgress: gridProgress } = useScroll({
    target: gridRef,
    offset: ["start 0.85", "start 0.3"],
  });

  // Convert scroll progress to "visible" state for the grid container
  // We use this to drive whileInView-equivalent via animate prop
  const gridInView = useTransform(gridProgress, [0, 0.1], [0, 1]);

  return (
    <section
      className="relative w-full min-h-screen pointer-events-auto"
      aria-label="About Ashaan — Core Profile"
    >
      {/* ── Inner max-width content wrapper ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col justify-center min-h-screen">

        {/* ── Section Header ──────────────────────────────────────── */}
        <motion.div
          className="mb-14 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-cyan-400 font-space tracking-[0.22em] text-xs uppercase font-semibold">
            // System Diagnosis
          </span>
          <h2 className="text-4xl md:text-5xl font-chakra font-bold text-white uppercase mt-2 tracking-wide">
            Core Profile
          </h2>
        </motion.div>

        {/* ── Bento Grid ──────────────────────────────────────────── */}
        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto font-space"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >

          {/* ── CARD [01 // Philosophy] ── 2 cols × 2 rows ────────── */}
          <BentoCard className="md:col-span-2 md:row-span-2 p-8" accentHover="cyan">
            {/* Accent icon top-right */}
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-80 group-hover:text-cyan-400 transition-all duration-300">
              <Terminal size={22} />
            </div>

            <div className="flex flex-col h-full justify-between min-h-[18rem]">
              <div>
                <span className="text-xs font-mono text-cyan-400/60 tracking-widest uppercase block mb-3">
                  [01 // Philosophy]
                </span>
                <h3 className="text-2xl md:text-3xl font-chakra font-bold text-white uppercase tracking-wide mb-5 leading-snug">
                  Engineering Digital Ecosystems
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-xl">
                  Main interfaces ko design nahi karta, balkay unke algorithms aur
                  responsive systems ko transform karta hon. Meray liye code sirf
                  markup nahi hai—yeh interactive performance, structural
                  pixel-perfection, aur clean structural architecture ka fusion hai.
                </p>
              </div>

              <div className="mt-8 flex gap-3 flex-wrap">
                <Tag label="Architecture Driven" color="cyan" />
                <Tag label="UI/UX Mechanics" color="slate" />
                <Tag label="Pixel-Perfect Systems" color="slate" />
              </div>
            </div>
          </BentoCard>

          {/* ── CARD [02 // Hardware Logic] ── 1 col × 2 rows ────── */}
          <BentoCard className="md:col-span-1 md:row-span-2 p-8" accentHover="emerald">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-80 group-hover:text-emerald-400 transition-all duration-300">
              <Cpu size={22} />
            </div>

            <div className="flex flex-col h-full justify-between min-h-[18rem]">
              <div>
                <span className="text-xs font-mono text-emerald-400/60 tracking-widest uppercase block mb-3">
                  [02 // Hardware Logic]
                </span>
                <h3 className="text-2xl font-chakra font-bold text-white uppercase tracking-wide mb-4 leading-snug">
                  The Stack &amp; Gear
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Mera workflow dynamic modular tools par built hai. Software
                  architecture se le kar operating environment tak, har cheez
                  optimized aur micro-controlled hai.
                </p>

                <ul className="mt-5 space-y-3 text-xs font-mono text-slate-400">
                  {[
                    "Linux Kernel Environments",
                    "React 3D Fiber & WebGL",
                    "Tailwind v4 Layouts",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-6">
                System: Stable_v2
              </div>
            </div>
          </BentoCard>

          {/* ── CARD [03 // Crafts] ── 1 col × 1 row ───────────────── */}
          <BentoCard className="md:col-span-1 md:row-span-1 p-6" accentHover="orange">
            <div className="flex flex-col h-full justify-between min-h-[10rem]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-orange-400/60 tracking-widest uppercase">
                    [03 // Crafts]
                  </span>
                  <Flame
                    size={16}
                    className="opacity-25 group-hover:text-orange-400 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
                <h4 className="text-lg font-chakra font-bold text-white uppercase tracking-wide mb-3">
                  Hardware Engineering
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Gadgets ko troubleshoot karna aur unhein scratch se customize
                  karna mera shauq hai. Hardware component diagnostics ki yahi
                  logic mujhe web projects ko depth se optimize karne mein madad
                  deti hai.
                </p>
              </div>
            </div>
          </BentoCard>

          {/* ── CARD [04 // Interface] ── 2 cols × 1 row — CTA ───── */}
          <BentoCard
            className="md:col-span-2 md:row-span-1 p-6 flex items-center justify-between gap-6"
            accentHover="indigo"
          >
            {/* Subtle directional gradient wash */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(6,182,212,0.03) 100%)",
              }}
            />

            <div className="relative max-w-md z-10">
              <span className="text-xs font-mono text-indigo-400/60 tracking-widest uppercase block mb-2">
                [04 // Interface]
              </span>
              <h4 className="text-xl md:text-2xl font-chakra font-bold text-white uppercase tracking-wide leading-snug">
                Got a digital vision or custom module to assemble?
              </h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Chalo isay clean component architectures aur immersive visuals ke
                sath design karte hain.
              </p>
            </div>

            {/* CTA micro-interactive button */}
            <button
              id="cta-contact-btn"
              className="relative z-10 flex items-center justify-center p-4 rounded-2xl bg-white text-slate-950 group-hover:bg-cyan-400 group-hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg shadow-white/10 shrink-0"
              aria-label="Start a project with Ashaan"
            >
              <ArrowUpRight
                size={20}
                className="group-hover:rotate-45 transition-transform duration-300"
              />
            </button>
          </BentoCard>

        </motion.div>
        {/* ── /Bento Grid ─────────────────────────────────────────── */}

      </div>
      {/* ── /Content wrapper ─────────────────────────────────────── */}
    </section>
  );
}
