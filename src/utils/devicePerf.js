export function getDevicePerformance() {
  if (typeof window === "undefined") {
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
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false;
  const deviceMemory = navigator.deviceMemory || 4;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  const reduceMotion = saveData || prefersReducedMotion;
  const lowEnd = reduceMotion || deviceMemory <= 4 || hardwareConcurrency <= 4;

  return {
    lowEnd,
    reduceMotion,
    saveData,
    prefersReducedMotion,
  };
}
