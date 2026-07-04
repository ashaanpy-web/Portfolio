import { useRef } from "react";
import { motion, useMotionValue, useVelocity, useTransform, useSpring } from "framer-motion";

export default function AboutCard() {
  const containerRef = useRef(null);

  // Motion values to track drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Velocity values
  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  // Smooth springs for velocity to prevent jitter
  const smoothXVelocity = useSpring(xVelocity, { stiffness: 400, damping: 50 });
  const smoothYVelocity = useSpring(yVelocity, { stiffness: 400, damping: 50 });

  // Map velocity to rotation (tilt). 
  // Dragging fast to the right (positive x velocity) tilts the right edge down.
  const rotateY = useTransform(smoothXVelocity, [-800, 800], [-15, 15], { clamp: true });
  const rotateX = useTransform(smoothYVelocity, [-800, 800], [15, -15], { clamp: true });

  return (
    <section className="relative w-full min-h-[80vh] flex items-center py-24 pointer-events-auto z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT COLUMN: THE SLEEK SYSTEM ARCHITECTURE NARRATIVE */}
        <div className="flex flex-col text-left font-space max-w-xl">
          <span className="text-cyan-400 tracking-[0.22em] text-xs uppercase font-semibold block mb-4">
            // SYSTEM OPERATOR
          </span>
          <h2 className="text-4xl md:text-5xl font-chakra font-bold text-white uppercase tracking-wide mb-6">
            About The Architect
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Main interfaces ko design nahi karta, balkay unke algorithms aur responsive systems ko transform karta hon. Meray liye code sirf markup nahi hai—yeh interactive performance, structural pixel-perfection, aur hardware diagnostics ka fusion hai. Software engineering se le kar physical gadget customization tak, har layer optimized aur micro-controlled hai.
          </p>
        </div>

        {/* RIGHT COLUMN: THE INTERACTIVE SPRING-LOADED ID CARD */}
        <div ref={containerRef} className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ x, y, rotateX, rotateY }}
            drag={true}
            dragConstraints={containerRef} // Bound to the local container so it doesn't break mobile layouts
            dragElastic={0.08}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 12 }}
            whileTap={{ scale: 0.95 }}
            className="w-72 h-[420px] mx-auto rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl relative p-5 flex flex-col justify-between overflow-hidden group select-none pointer-events-auto cursor-grab active:cursor-grabbing"
          >
            {/* Lanyard slot clip design */}
            <div className="w-16 h-2 bg-slate-800 rounded-full mx-auto border border-slate-700 shadow-inner mb-2" />

            {/* Image frame container */}
            <div className="w-40 h-40 mx-auto rounded-xl border border-slate-700 bg-slate-950/80 overflow-hidden relative flex items-center justify-center mb-4">
              {/* Fallback pattern / Placeholder for avatar */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 flex items-center justify-center">
                <div className="w-full h-full opacity-20" style={{ backgroundImage: "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              </div>
              <img 
                src="/avatar.jpg" 
                alt="Ashaan" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500 z-10" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="absolute bottom-2 z-20 text-[8px] font-mono text-cyan-400 bg-black/70 px-2 py-0.5 rounded tracking-widest backdrop-blur-md">
                PHOTO_LOADED
              </span>
            </div>

            {/* ID Matrix Data */}
            <div className="flex flex-col gap-3 font-mono text-xs uppercase w-full px-2 mt-auto">
              <div className="flex justify-between border-b border-slate-700/50 pb-1.5">
                <span className="text-slate-500 tracking-wider">Name</span>
                <span className="text-white font-semibold">ASHAAN</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-1.5">
                <span className="text-slate-500 tracking-wider">Role</span>
                <span className="text-cyan-400 font-semibold tracking-wider shadow-cyan-500/50 drop-shadow-sm">SYSTEM DEVELOPER v2.2</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/50 pb-1.5">
                <span className="text-slate-500 tracking-wider">Core</span>
                <span className="text-slate-300">CORE_CS_ENGINE</span>
              </div>
            </div>

            {/* subtle ambient glow on hover */}
            <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
