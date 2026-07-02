import React from "react";
import SpaceBG from "./components/SpaceBG";
import OrbitSystem from "./components/OrbitSystem";
import AboutBento from "./components/AboutBento";
import "./index.css";

export default function App() {
  return (
    // pointer-events-none standard layers ko safe rakhne ke liye main parent ko dynamic set kiya
    <div className="relative w-full min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* 1. Base Isolated Canvas Starfield */}
      <SpaceBG />

      {/* 2. Fixed Dynamic Overlay (Hero Frame) */}
      <OrbitSystem />

      {/* 3. Scrollable Structural HTML Blocks */}
      {/* Is spacer div ki wajah se pehle full hero visual dikhega, phir bento section trigger hoga */}
      <div className="w-full h-screen pointer-events-none" />

      {/* Bento Grid Layer */}
      <AboutBento />
    </div>
  );
}
