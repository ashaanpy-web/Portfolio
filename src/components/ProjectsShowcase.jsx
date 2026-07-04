import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    id: "01",
    title: "Liquid Glass Weather App",
    description:
      "An advanced real-time meteorological portal featuring a high-fidelity liquid glass design system. Implements hardware-accelerated backdrop blur filters, smooth meteorological vector changes, and precise geolocation state synchronization pipelines.",
    color: "cyan",
    hex: "#06b6d4",
    hoverBorder: "hover:border-cyan-500/50",
    tags: ["React.js", "Tailwind v4", "OpenWeather API", "Framer Motion"],
    liveUrl: "https://inquisitive-flan-879b24.netlify.app/",
  },
  {
    id: "02",
    title: "Flex Tracker",
    description:
      "A high-performance modern fitness ecosystem designed to optimize tracking metrics and workout routines. Implements dynamic progress state analytics, interactive target logging systems, and fluid reactive UI architecture tailored for absolute performance.",
    color: "orange",
    hex: "#f97316",
    hoverBorder: "hover:border-orange-500/50",
    tags: ["React.js", "Tailwind CSS", "Context API", "Local Storage Engine"],
    liveUrl: "https://ubiquitous-cat-f5fa76.netlify.app/",
  },
  {
    id: "03",
    title: "Nexus 3D E-Commerce Store",
    description:
      "An immersive, interactive 3D animated digital showroom showcasing next-gen electronics. Engineered with WebGL-backed product viewing spaces, micro-soldering gear showcases, and custom responsive animation states using modular UI structures.",
    color: "red",
    hex: "#ef4444",
    hoverBorder: "hover:border-red-500/50",
    tags: ["React.js", "Three.js", "React Three Fiber", "Tailwind CSS"],
    liveUrl: "https://sprightly-granita-7a510c.netlify.app/",
  },
];

export default function ProjectsShowcase() {
  return (
    <section className="relative w-full py-24 pointer-events-auto z-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <span className="text-cyan-400 font-space tracking-[0.22em] text-xs uppercase font-semibold block mb-2">
            // Selected Operations
          </span>
          <h2 className="text-4xl md:text-5xl font-chakra font-bold text-white uppercase tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Project Logs
          </h2>
        </div>

        {/* The Grid Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className={`group relative bg-slate-950/40 border border-slate-800/60 backdrop-blur-xl rounded-3xl p-6 overflow-hidden flex flex-col justify-between h-96 transition-all duration-300 ${project.hoverBorder}`}
            >
              {/* The Cosmic Shadow Spread (Pseudo-element equivalent) */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-300 pointer-events-none"
                style={{ backgroundColor: project.hex }}
              />

              {/* Top Section */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span
                    className="text-xs font-mono tracking-widest uppercase opacity-60"
                    style={{ color: project.hex }}
                  >
                    [{project.id} // Project]
                  </span>

                  {/* Interactive Controls */}
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-slate-950 transition-all duration-300 group-hover:scale-110 active:scale-95 text-white"
                  >
                    <ArrowUpRight
                      size={18}
                      className="group-hover:rotate-45 transition-transform duration-300"
                    />
                  </a>
                </div>

                <h3 className="text-2xl font-chakra font-bold text-white uppercase tracking-wide mb-3 leading-snug">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
                  {project.description}
                </p>
              </div>

              {/* Bottom Section (Tech Stack Tags) */}
              <div className="relative z-10 flex flex-wrap gap-2 mt-6">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono border border-slate-700/50 bg-slate-800/40 text-slate-300 px-2.5 py-1 rounded-md uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}