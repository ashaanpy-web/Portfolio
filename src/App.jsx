import React from "react";
import HeroScene from "./components/HeroScene";
import "./index.css";

export default function App() {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* PHASE 1: Hero Scene Component driven element */}
      <HeroScene />

      {/* Baqi sections jab hum banayein gay, to unka separate component yahan neche asani se call ho jaye ga */}
    </div>
  );
}
