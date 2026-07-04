import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useVelocity, useTransform, useSpring, useAnimation } from "framer-motion";

export default function AboutCard() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20%" });
  const controls = useAnimation();

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

  // Handle Entrance Drop
  useEffect(() => {
    if (isInView) {
      controls.start({ 
        y: 0, 
        x: 0, 
        opacity: 1, 
        rotate: 0,
        transition: { type: "spring", stiffness: 380, damping: 14 } 
      });
    } else {
      controls.start({ 
        y: -250, 
        opacity: 0, 
        rotate: -15,
        transition: { duration: 0.2 }
      });
    }
  }, [isInView, controls]);

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
    <section ref={sectionRef} className="relative w-full min-h-[100vh] flex items-center py-24 pointer-events-auto z-20">
      
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
        </div>
        <div className="col-span-1 hidden lg:block" />
      </div>

      {/* RIGHT COLUMN OVERLAY: THE GLOBAL VIEWPORT SHELL */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible flex items-center justify-end">
        <div className="relative w-full lg:w-1/2 h-full flex items-center justify-center">

          {/* DYNAMIC THE TETHER STRING */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-cyan-500 via-slate-700/60 to-slate-400/40 origin-top"
            style={{ 
              height: ropeHeight,
              rotate: ropeRotate,
              scaleY: ropeScaleY,
              opacity: useTransform(y, (latestY) => (latestY < -240 && !isInView ? 0 : 1))
            }}
          />

          {/* THE FREE-FLOATING ID CARD */}
          <motion.div
            animate={controls}
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
