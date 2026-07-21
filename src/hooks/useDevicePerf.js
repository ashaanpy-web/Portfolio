import { useMemo } from "react";

export function useDevicePerf() {
  return useMemo(() => {
    if (typeof navigator === "undefined") {
      return {
        lowEnd: false,
        reduceMotion: false,
        saveData: false,
        prefersReducedMotion: false,
      };
    }

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection ||
      {};

    const saveData = Boolean(connection.saveData);
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const deviceMemory = navigator.deviceMemory || 4;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    const reduceMotion = saveData || prefersReducedMotion;
    const lowEnd =
      reduceMotion || deviceMemory <= 4 || hardwareConcurrency <= 4;

    return {
      lowEnd,
      reduceMotion,
      saveData,
      prefersReducedMotion,
    };
  }, []);
}
