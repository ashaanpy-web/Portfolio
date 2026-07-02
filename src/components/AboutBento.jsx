import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Terminal, Cpu, Flame, ArrowUpRight } from "lucide-react";

export default function AboutBento() {
  const containerRef = useRef(null);

  // Scroll tracking for this specific component viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Dynamic animations based on scroll distance
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0.9, 1, 1, 0.85],
  );
  const y = useTransform(scrollYProgress, [0, 0.25], [100, 0]);

  // 4. DYNAMIC GLOW COLOR PIPELINE
  // Scroll ke sath background color cyan se deep purple/indigo aur transparent mein shift hoga
  const glowBg = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7, 1],
    [
      "radial-gradient(circle, rgba(6,182,212,0) 0%, transparent 70%)",
      "radial-gradient(circle, rgba(6,182,212,0.45) 0%, rgba(99,102,241,0.2) 50%, transparent 75%)", // Cyan/Indigo active
      "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.15) 50%, transparent 75%)", // Purple/Pink shift
      "radial-gradient(circle, rgba(6,182,212,0) 0%, transparent 70%)",
    ],
  );

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity, scale, y }}
      className="relative w-full min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto z-20 pointer-events-auto flex flex-col justify-center"
    >
      {/* 1. DYNAMIC SCROLL-DRIVEN TRACKING GLOW */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[750px] h-[350px] md:h-[750px] rounded-full opacity-40 blur-[110px] pointer-events-none z-0"
        style={{ background: glowBg }}
      />

      {/* Section Header */}
      <div className="relative mb-16 text-center md:text-left z-10">
        <span className="text-cyan-400 font-space tracking-[0.2em] text-xs uppercase font-semibold">
          // System Diagnosis
        </span>
        <h2 className="text-4xl md:text-5xl font-chakra font-bold text-white uppercase mt-2 tracking-wide">
          Core Profile
        </h2>
      </div>

      {/* 2. THE BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-55 relative z-10 font-space">
        {/* CARD 1: Big Overview */}
        <div className="md:col-span-2 md:row-span-2 group relative rounded-3xl p-8 overflow-hidden bg-slate-950/40 border border-slate-800/50 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 group-hover:text-cyan-400 transition-all">
            <Terminal size={22} />
          </div>
          <div className="flex flex-col h-full justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase block mb-2">
                [01 // Philosophy]
              </span>
              <h3 className="text-2xl font-chakra font-bold text-white uppercase tracking-wide mb-4">
                Engineering Digital Ecosystems
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base max-w-xl">
                Main interfaces ko design nahi karta, balkay unke algorithms aur
                responsive systems ko transform karta hon. Meray liye code sirf
                markup nahi hai—yeh interactive performance, structural
                pixel-perfection, aur clean structural architecture ka fusion
                hai.
              </p>
            </div>
            <div className="mt-6 flex gap-3 flex-wrap">
              <span className="text-[11px] font-mono bg-cyan-950/30 text-cyan-400 border border-cyan-800/30 px-3 py-1 rounded-md">
                Architecture Driven
              </span>
              <span className="text-[11px] font-mono bg-slate-900/60 text-slate-400 border border-slate-800/50 px-3 py-1 rounded-md">
                UI/UX Mechanics
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: Technical Focus */}
        <div className="md:col-span-1 md:row-span-2 group relative rounded-3xl p-8 overflow-hidden bg-slate-950/40 border border-slate-800/50 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 group-hover:text-emerald-400 transition-all">
            <Cpu size={22} />
          </div>
          <div className="flex flex-col h-full justify-between">
            <div>
              <span className="text-xs font-mono text-emerald-400/70 tracking-widest uppercase block mb-2">
                [02 // Hardware Logic]
              </span>
              <h3 className="text-2xl font-chakra font-bold text-white uppercase tracking-wide mb-4">
                The Stack & Gear
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mera workflow dynamic modular tools par built hai. Software
                architecture se le kar operating environment tak, har cheez
                optimized aur micro-controlled hai:
              </p>
              <ul className="mt-4 space-y-2 text-xs font-mono text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />{" "}
                  Linux Kernel Environments
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />{" "}
                  React 3D Fiber & WebGL
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />{" "}
                  Tailwind v4 Layouts
                </li>
              </ul>
            </div>
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-4">
              System: Stable_v2
            </div>
          </div>
        </div>

        {/* CARD 3: Creative Hobby Connection */}
        <div className="md:col-span-1 md:row-span-1 group relative rounded-3xl p-6 overflow-hidden bg-slate-950/40 border border-slate-800/50 backdrop-blur-xl transition-all duration-300 hover:border-orange-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-orange-400/70 tracking-widest uppercase">
                  [03 // Crafts]
                </span>
                <Flame
                  size={16}
                  className="opacity-40 group-hover:text-orange-400 group-hover:opacity-100 transition-all"
                />
              </div>
              <h4 className="text-lg font-chakra font-bold text-white uppercase tracking-wide">
                Hardware Engineering
              </h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Gadgets ko troubleshoot karna aur unhein scratch se customize
                karna mera shauq hai. Hardware component diagnostics ki yahi
                logic mujhe web projects ko depth se optimize karne mein madad
                deti hai.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 4: Call to Action Integration */}
        <div className="md:col-span-2 md:row-span-1 group relative rounded-3xl p-6 overflow-hidden bg-linear-to-r from-slate-950/50 to-indigo-950/20 border border-slate-800/50 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-between">
          <div className="max-w-md">
            <span className="text-xs font-mono text-indigo-400/70 tracking-widest uppercase block mb-1">
              [04 // Interface]
            </span>
            <h4 className="text-xl font-chakra font-bold text-white uppercase tracking-wide">
              Got a digital vision or custom module to assemble?
            </h4>
            <p className="text-slate-400 text-xs mt-1">
              Chalo isay clean component architectures aur immersive visuals ke
              sath design karte hain.
            </p>
          </div>
          <button className="flex items-center justify-center p-4 rounded-2xl bg-white text-slate-950 group-hover:bg-cyan-400 group-hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
            <ArrowUpRight
              size={20}
              className="group-hover:rotate-45 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
