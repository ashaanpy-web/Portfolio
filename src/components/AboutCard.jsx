import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useVelocity, useTransform, useSpring, useAnimation, AnimatePresence } from "framer-motion";
import { premiumViewportVariants } from "../utils/animations";

export default function AboutCard() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20%" });
  const controls = useAnimation();

  // 1. STATE TOGGLE FOR QUANTUM BADGE
  const [isCardVisible, setIsCardVisible] = useState(true);

  // Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  const smoothXVelocity = useSpring(xVelocity, { stiffness: 400, damping: 50 });
  const smoothYVelocity = useSpring(yVelocity, { stiffness: 400, damping: 50 });

  // Map drag velocity to 3D rotation tilts
  const rotateY = useTransform(smoothXVelocity, [-1000, 1000], [-35, 35], { clamp: true });
  const rotateX = useTransform(smoothYVelocity, [-1000, 1000], [35, -35], { clamp: true });

  // DYNAMIC TETHER STRING TRIGONOMETRY
  const ropeHeight = 350; // Base resting length of the cable

  // Angle: Calculate from vertical anchor to moving card center
  const ropeRotate = useTransform([x, y], ([latestX, latestY]) => {
    const angleRadians = Math.atan2(latestX, ropeHeight + latestY);
    return -angleRadians * (180 / Math.PI); // CSS rotation is clockwise, negative swings bottom to the right.
  });

  // Length: Pythagorean stretch
  const ropeScaleY = useTransform([x, y], ([latestX, latestY]) => {
    const length = Math.sqrt(latestX * latestX + Math.pow(ropeHeight + latestY, 2));
    return length / ropeHeight;
  });

  // Handle Entrance Drop & Mount Jolt
  useEffect(() => {
    if (isInView && isCardVisible) {
      controls.start({
        y: 0,
        x: 0,
        opacity: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 350, damping: 13 }
      });
    }
  }, [isInView, isCardVisible, controls]);

  // Handle Snapback Mechanics With Mass Overcome
  const handleDragEnd = () => {
    controls.start({
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 140,  // Natural gravitational cable tension
        damping: 10,     // Allows loose realistic swing iterations before stop
        mass: 1.5        // Simulates the physical heft of a composite plastic ID badge
      }
    });
  };

  return (
    <motion.section
      ref={sectionRef}
      variants={premiumViewportVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, amount: 0.15 }}
      className="relative w-full min-h-[100vh] flex items-center py-24 pointer-events-auto z-20"
    >

      {/* LEFT COLUMN: STATIC GRID CONTEXT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="col-span-1 flex flex-col text-left font-space max-w-xl relative z-10">
          <span className="text-cyan-400 tracking-[0.22em] text-xs uppercase font-semibold block mb-4 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            // SYSTEM OPERATOR
          </span>
          <h2 className="text-4xl md:text-5xl font-chakra font-bold text-white uppercase tracking-wide mb-6">
            About The Architect
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Main interfaces ko design nahi karta, balkay unke algorithms aur responsive systems ko transform karta hon. Meray liye code sirf markup nahi hai—yeh interactive performance, structural pixel-perfection, aur hardware diagnostics ka fusion hai. Software engineering se le kar physical gadget customization tak, har layer optimized aur micro-controlled hai.
          </p>

          {/* THE ACTION CONTROL GRID (THE DUAL BUTTONS) */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button className="group relative bg-white/5 border border-white/10 backdrop-blur-md px-6 py-3 rounded-full font-mono text-xs uppercase tracking-wider text-white transition-all duration-300 transform-gpu hover:scale-105 pointer-events-auto cursor-pointer overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-[15px] transition-all duration-500 ease-out pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)" }} />
              <span className="relative z-10">About me!</span>
            </button>
            <button
              onClick={() => setIsCardVisible((v) => !v)}
              className="group relative bg-white/5 border border-white/10 backdrop-blur-md px-6 py-3 rounded-full font-mono text-xs uppercase tracking-wider text-white transition-all duration-300 transform-gpu hover:scale-105 pointer-events-auto cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-[15px] transition-all duration-500 ease-out pointer-events-none rounded-full" style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)" }} />
              <span className="relative z-10">Hide/Show card</span>
            </button>
          </div>
        </div>
        <div className="col-span-1 hidden lg:block" />
      </div>

      {/* RIGHT COLUMN OVERLAY: THE GLOBAL VIEWPORT SHELL */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible flex items-center justify-end">
        <div className="relative w-full lg:w-1/2 h-full flex items-center justify-center">

          {/* THE MOUNT/UNMOUNT CONDITIONAL ANIMATION PIPELINE */}
          <AnimatePresence>
            {isCardVisible && (
              <>
                {/* DYNAMIC THE TETHER STRING */}
                {/* Wrapping rope in an animate presence handler so it scales in/out with the card */}
                <motion.div
                  key="quantum-rope"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ type: "spring", stiffness: 350, damping: 13 }}
                  className="absolute inset-0 pointer-events-none origin-top"
                >
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-cyan-500 via-slate-700/60 to-slate-400/40 origin-top"
                    style={{
                      height: ropeHeight,
                      rotate: ropeRotate,
                      scaleY: ropeScaleY, // Live Pythagorean scale hooks
                    }}
                  />
                </motion.div>

                {/* THE FREE-FLOATING ID CARD */}
                <motion.div
                  key="quantum-badge"
                  initial={{ opacity: 0, y: -300 }}
                  animate={controls}
                  exit={{ opacity: 0, y: 150, filter: "blur(10px)", scale: 0.9, transition: { duration: 0.4, ease: [0.55, 0.085, 0.68, 0.53] } }}
                  drag={true}
                  onDragEnd={handleDragEnd}
                  style={{ x, y, rotateX, rotateY }}
                  whileTap={{ scale: 0.96 }}
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

                      <span className="text-white text-3xl m-auto  font-chakra uppercase tracking-widest mt-3 font-bold">ASHAAN</span>
                    </div>


                  </div>

                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

    </motion.section>
  );
}
