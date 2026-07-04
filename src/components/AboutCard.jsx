import { useRef } from "react";
import { motion, useInView, useMotionValue, useVelocity, useTransform, useSpring } from "framer-motion";

export default function AboutCard() {
  const sectionRef = useRef(null);
  
  // 1. CONDITIONAL SCROLL ENTRY ENGINE
  const isInView = useInView(sectionRef, { once: false, margin: "-20%" });

  // 3. ADVANCED DRAG PHYSICS & RESET CONSTANTS
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  const smoothXVelocity = useSpring(xVelocity, { stiffness: 400, damping: 50 });
  const smoothYVelocity = useSpring(yVelocity, { stiffness: 400, damping: 50 });

  // Map rotational offset skewed against the cursor velocity vector
  const rotateY = useTransform(smoothXVelocity, [-1000, 1000], [-35, 35], { clamp: true });
  const rotateX = useTransform(smoothYVelocity, [-1000, 1000], [35, -35], { clamp: true });

  // 4. DYNAMIC CABLE MAPPING (SVG Line Coordinates)
  // The card height is 384px (h-96), so its top center is 192px above its absolute center.
  // We use `calc` to map the Framer Motion x/y offsets to the SVG coordinate space.
  const lineX2 = useTransform(x, (v) => `calc(50% + ${v}px)`);
  const lineY2 = useTransform(y, (v) => `calc(50% - 192px + ${v}px)`);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[100vh] flex items-center py-24 pointer-events-auto z-20">
      
      {/* LEFT COLUMN: STATIC GRID CONTEXT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="col-span-1 flex flex-col text-left font-space max-w-xl">
          <span className="text-cyan-400 tracking-[0.22em] text-xs uppercase font-semibold block mb-4 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            // SYSTEM OPERATOR
          </span>
          <h2 className="text-4xl md:text-5xl font-chakra font-bold text-white uppercase tracking-wide mb-6">
            About The Architect
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Main interfaces ko design nahi karta, balkay unke algorithms aur responsive systems ko transform karta hon. Meray liye code sirf markup nahi hai—yeh interactive performance, structural pixel-perfection, aur hardware diagnostics ka fusion hai. Software engineering se le kar physical gadget customization tak, har layer optimized aur micro-controlled hai.
          </p>
        </div>
        {/* Right column placeholder for layout spacing */}
        <div className="col-span-1 hidden lg:block" />
      </div>

      {/* RIGHT COLUMN OVERLAY: THE GLOBAL VIEWPORT SHELL */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible flex items-center justify-end">
        <div className="relative w-full lg:w-1/2 h-full flex items-center justify-center">

          {/* DYNAMIC TENSION SUSPENSION LINE (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <linearGradient id="cyberRope" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(100, 116, 139, 0.8)" /> {/* slate-500/80 */}
                <stop offset="50%" stopColor="rgba(51, 65, 85, 0.3)" />   {/* slate-700/30 */}
                <stop offset="100%" stopColor="rgba(30, 41, 59, 0.1)" />  {/* slate-800/10 */}
              </linearGradient>
            </defs>
            <motion.line
              x1="50%"
              y1="0"
              x2={lineX2}
              y2={lineY2}
              stroke="url(#cyberRope)"
              strokeWidth="1.5"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          </svg>

          {/* THE FREE-FLOATING ID CARD */}
          <motion.div
            // Entrance Drop Sequence
            initial={{ opacity: 0, y: -250, rotate: -15 }}
            animate={isInView ? { y: 0, opacity: 1, rotate: 0 } : { opacity: 0, y: -250, rotate: -15 }}
            transition={{ type: "spring", stiffness: 380, damping: 14 }}
            
            // Expanded Infinite Drag Boundaries
            drag={true}
            dragConstraints={sectionRef} // Bound to the main full-width section ref
            dragElastic={0.25}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 12 }}
            
            style={{ x, y, rotateX, rotateY }}
            whileTap={{ scale: 0.96 }}
            
            // The Restored Action Vector
            className="bg-slate-950/80 border border-slate-800/60 rounded-2xl w-64 h-96 p-4 flex flex-col justify-between relative shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing pointer-events-auto transform-gpu will-change-transform"
          >
            {/* Top Lanyard Slot */}
            <div className="w-12 h-1.5 bg-slate-900 rounded-full mx-auto border border-slate-800 shadow-inner mb-4 relative z-10" />

            {/* Photo Frame Grid Box */}
            <div className="w-full h-44 rounded-xl border border-slate-800/80 bg-slate-900/50 relative flex items-center justify-center overflow-hidden mb-4">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
              <img 
                src="/avatar.jpg" 
                alt="Ashaan" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-70 hover:mix-blend-normal hover:opacity-100 transition-all duration-500 z-10" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="absolute bottom-2 z-20 text-[9px] font-mono text-cyan-400 bg-slate-950/80 px-2 py-0.5 rounded tracking-widest border border-cyan-900/50 backdrop-blur-md">
                PHOTO_LOADED
              </span>
            </div>

            {/* Data Lines */}
            <div className="flex flex-col gap-2.5 font-mono text-[10px] uppercase w-full">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500 tracking-wider">Name</span>
                <span className="text-white font-medium">ASHAAN</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500 tracking-wider">Role</span>
                <span className="text-cyan-400 font-medium tracking-wide">SYSTEM DEVELOPER</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500 tracking-wider">Core</span>
                <span className="text-slate-300">CORE_CS_ENGINE</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

    </section>
  );
}
