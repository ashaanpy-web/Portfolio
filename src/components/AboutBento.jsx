import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Terminal, Cpu, Flame, ArrowUpRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   BentoCard — REFRACTORED FOR WHITE CYBER GLASS & BIGGER SIZE
   ═══════════════════════════════════════════════════════════════════ */
function BentoCard({
  className = "",
  children,
  accentHover = "cyan",
  // 1. ISKO WHITE GLASS CONFIGURATION DIA HAI:
  baseBg = "bg-white/10 backdrop-blur-md",
  baseBorder = "border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]"
}) {

  // Hover karne par glow ko white blends ke sath match karne ke liye borders:
  const hoverBorderMap = {
    cyan: "hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    emerald: "hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    orange: "hover:border-orange-400/60 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]",
    indigo: "hover:border-indigo-400/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]",
  };

  return (
    <motion.div
      variants={cardVariants}
      className={[
        "bento-card-glow",
        "group relative rounded-3xl overflow-hidden",
        baseBg,
        baseBorder,
        "transition-all duration-300 ease-out",
        hoverBorderMap[accentHover] ?? hoverBorderMap.cyan,
        className,
      ].join(" ")}
    >
      {/* Dynamic light reflection line inside white card */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />
      {children}
    </motion.div>
  );
}

export default function AboutBento() {
  const gridRef = useRef(null);

  return (
    <section className="relative w-full min-h-screen pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col justify-center min-h-screen">

        {/* Bento Grid */}
        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto font-space" // gap ko 4 se 6 kar dia taake space bada lage
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >

          {/* ── CARD [01 // Philosophy] ── SIZE KO BADA KIYA HAI (min-h-[22rem]) ── */}
          <BentoCard className="md:col-span-2 md:row-span-2 p-8" accentHover="cyan">
            <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-90 group-hover:text-cyan-400 transition-all duration-300">
              <Terminal size={24} /> {/* Icon size also scaled up */}
            </div>

            {/* min-h-[18rem] ko badhakar min-h-[22rem] kar dia hai vertical depth badhane ke liye */}
            <div className="flex flex-col h-full justify-between min-h-[22rem]">
              <div>
                <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase block mb-3">
                  [01 // Philosophy]
                </span>
                {/* Text styling updated to solid crisp white */}
                <h3 className="text-2xl md:text-4xl font-chakra font-bold text-white uppercase tracking-wide mb-6 leading-snug drop-shadow-sm">
                  Engineering Digital Ecosystems
                </h3>
                {/* Text readability increased on white backdrop by using text-slate-200 */}
                <p className="text-slate-200 leading-relaxed text-sm md:text-base max-w-2xl">
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

          {/* Baaki cards me bhi standard structural size updates automatic inherit ho jayenge */}

        </motion.div>
      </div>
    </section>
  );
}