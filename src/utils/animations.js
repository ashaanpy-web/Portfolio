export const premiumViewportVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: "blur(8px)", // Soft hardware-accelerated focal blur entry
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.85, 
      ease: [0.16, 1, 0.3, 1], // Custom premium cubic-bezier easing curve
      staggerChildren: 0.12     // Handles internal layout item flows seamlessly
    }
  },
  exit: {
    opacity: 0,
    y: -40,
    filter: "blur(6px)",
    transition: { duration: 0.5, ease: [0.7, 0, 0.84, 0] }
  }
};
