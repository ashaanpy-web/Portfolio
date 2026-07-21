import { motion } from "framer-motion";
import { useDevicePerf } from "../hooks/useDevicePerf";
import { premiumViewportVariants } from "../utils/animations";

const TECH_ITEMS = [
  "HTML5",
  "CSS3",
  "TAILWIND v4",
  "JAVASCRIPT",
  "REACT.JS",
  "THREE.JS",
  "FRAMER MOTION",
  "LINUX KERNEL",
  "FEDORA",
  "GIT",
  "NEOVIM",
];

export default function TechConveyorBelt() {
  const { lowEnd, reduceMotion } = useDevicePerf();
  const animate = !lowEnd && !reduceMotion;

  const MARQUEE_GROUP = (
    <>
      {TECH_ITEMS.map((item, i) => (
        <div key={i} className="flex items-center shrink-0">
          <span className="text-white font-chakra text-2xl md:text-3xl font-bold uppercase tracking-[0.15em] mx-6">
            {item}
          </span>
          <span className="text-white/60 mx-4 text-xl shrink-0">•</span>
        </div>
      ))}
    </>
  );

  return (
    <motion.section
      variants={premiumViewportVariants}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: false, amount: 0.4 }}
      className="relative w-full h-40 md:h-48 overflow-hidden pointer-events-auto z-20 flex items-center justify-center bg-transparent"
    >
      <div className="absolute top-1/2 left-[-5vw] w-[110vw] -translate-y-1/2 rotate-[-2.5deg] bg-[#2c3539] shadow-2xl shadow-orange-500/20 flex items-center h-20 md:h-24">
        <motion.div
          className="flex whitespace-nowrap items-center w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          <div className="flex shrink-0">{MARQUEE_GROUP}</div>
          <div className="flex shrink-0">{MARQUEE_GROUP}</div>
        </motion.div>
      </div>
    </motion.section>
  );
}
