import { useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// useLiquidGlass — Apple-Style Liquid Glass Refraction Engine
// ─────────────────────────────────────────────────────────────────────────────
// Architecture:
//   1. Browser compatibility gate (Chromium required; Safari/Firefox → blur fallback)
//   2. Hidden SVG portal injection with <defs> container for filter primitives
//   3. Canvas displacement map: R-channel (X) + B-channel (Y) + gray interior
//   4. SVG filter: feImage → 3× feDisplacementMap (staggered) → feColorMatrix
//      channel isolators → feBlend screen → chromatic aberration fringe
//   5. ResizeObserver: rebakes displacement map ONLY on physical size change
//      so position-only transforms (drag, spring, pendulum) stay at 120 FPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {object}  options
 * @param {number}  [options.scale=18]       Base displacement intensity (pixels)
 * @param {number}  [options.chroma=3]       Per-channel chromatic offset
 * @param {number}  [options.borderRadius=16] Card border-radius for interior mask
 * @param {boolean} [options.enabled=true]   Master on/off toggle
 * @returns {{ ref: React.RefObject, filterId: string, isNative: boolean }}
 */
export function useLiquidGlass({
  scale = 18,
  chroma = 3,
  borderRadius = 16,
  enabled = true,
} = {}) {
  const targetRef = useRef(null);
  const svgRef = useRef(null);
  const roRef = useRef(null);
  const filterIdRef = useRef(`lg-${Math.random().toString(36).slice(2, 9)}`);
  const lastSizeRef = useRef({ w: 0, h: 0 });

  // ─── 1. BROWSER COMPATIBILITY CHECK ────────────────────────────────────────
  // Chromium exposes `chrome` on window. Safari/Firefox do not.
  // We also check feDisplacementMap support via a quick SVG feature query.
  const isNative = (() => {
    if (typeof window === "undefined") return false;
    const isChromium =
      !!window.chrome ||
      navigator.userAgent.includes("Chrome") ||
      navigator.userAgent.includes("Chromium");
    const isFirefox = navigator.userAgent.includes("Firefox");
    const isSafari =
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome");
    return isChromium && !isFirefox && !isSafari;
  })();

  // ─── 2. DISPLACEMENT MAP BAKER ─────────────────────────────────────────────
  const bakeDisplacementMap = useCallback(
    (w, h) => {
      if (w === 0 || h === 0) return null;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      // ── X-displacement: red channel, left → right gradient ────────────────
      const gradX = ctx.createLinearGradient(0, 0, w, 0);
      gradX.addColorStop(0, "rgb(0,0,0)");
      gradX.addColorStop(1, "rgb(255,0,0)");
      ctx.fillStyle = gradX;
      ctx.fillRect(0, 0, w, h);

      // ── Y-displacement: blue channel, top → bottom gradient ───────────────
      // Using "screen" composite allows R+B to coexist cleanly
      ctx.globalCompositeOperation = "screen";
      const gradY = ctx.createLinearGradient(0, 0, 0, h);
      gradY.addColorStop(0, "rgb(0,0,0)");
      gradY.addColorStop(1, "rgb(0,0,255)");
      ctx.fillStyle = gradY;
      ctx.fillRect(0, 0, w, h);

      // ── Interior neutralizer: 50%-gray blurred rounded rectangle ──────────
      // Confines refraction to edge band — interior stays optically flat
      ctx.globalCompositeOperation = "source-over";
      const inset = Math.max(borderRadius * 1.5, 32);
      ctx.filter = `blur(${Math.round(inset * 0.6)}px)`;
      ctx.fillStyle = "rgb(128,128,128)";
      const r = Math.max(borderRadius - 4, 4);
      const ix = inset;
      const iy = inset;
      const iw = w - inset * 2;
      const ih = h - inset * 2;
      if (iw > 0 && ih > 0) {
        ctx.beginPath();
        ctx.moveTo(ix + r, iy);
        ctx.lineTo(ix + iw - r, iy);
        ctx.quadraticCurveTo(ix + iw, iy, ix + iw, iy + r);
        ctx.lineTo(ix + iw, iy + ih - r);
        ctx.quadraticCurveTo(ix + iw, iy + ih, ix + iw - r, iy + ih);
        ctx.lineTo(ix + r, iy + ih);
        ctx.quadraticCurveTo(ix, iy + ih, ix, iy + ih - r);
        ctx.lineTo(ix, iy + r);
        ctx.quadraticCurveTo(ix, iy, ix + r, iy);
        ctx.closePath();
        ctx.fill();
      }
      ctx.filter = "none";

      return canvas.toDataURL("image/png");
    },
    [borderRadius]
  );

  // ─── 3. SVG FILTER BUILDER ─────────────────────────────────────────────────
  const buildFilter = useCallback(
    (w, h, dataUri) => {
      const filterId = filterIdRef.current;
      const imgId = `${filterId}-img`;

      // scales for R, G, B passes
      const scaleR = scale;
      const scaleG = scale + chroma;
      const scaleB = scale + chroma * 2;

      // color-interpolation-filters="sRGB" is MANDATORY — prevents
      // linearRGB gamma correction from shifting ghost colours
      return `
      <filter
        id="${filterId}"
        x="-10%" y="-10%" width="120%" height="120%"
        color-interpolation-filters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feImage
          id="${imgId}"
          href="${dataUri}"
          x="0" y="0"
          width="${w}" height="${h}"
          result="dispMap"
          preserveAspectRatio="none"
        />

        <!-- RED channel pass (base scale) -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="dispMap"
          scale="${scaleR}"
          xChannelSelector="R"
          yChannelSelector="B"
          result="dispR"
        />
        <feColorMatrix
          type="matrix"
          in="dispR"
          values="1 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0"
          result="isoR"
        />

        <!-- GREEN channel pass (mid scale) -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="dispMap"
          scale="${scaleG}"
          xChannelSelector="R"
          yChannelSelector="B"
          result="dispG"
        />
        <feColorMatrix
          type="matrix"
          in="dispG"
          values="0 0 0 0 0
                  0 1 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0"
          result="isoG"
        />

        <!-- BLUE channel pass (max scale — most aberration) -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="dispMap"
          scale="${scaleB}"
          xChannelSelector="R"
          yChannelSelector="B"
          result="dispB"
        />
        <feColorMatrix
          type="matrix"
          in="dispB"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0"
          result="isoB"
        />

        <!-- Merge passes via 'screen' blending to get full-color aberration fringe -->
        <feBlend in="isoR" in2="isoG" mode="screen" result="blendRG" />
        <feBlend in="blendRG" in2="isoB" mode="screen" result="blendRGB" />
      </filter>
      `.trim();
    },
    [scale, chroma]
  );

  // ─── 4. INJECT / UPDATE SVG PORTAL ─────────────────────────────────────────
  const rebake = useCallback(
    (w, h) => {
      if (!svgRef.current || !enabled || !isNative) return;

      const dataUri = bakeDisplacementMap(w, h);
      if (!dataUri) return;

      const filterMarkup = buildFilter(w, h, dataUri);
      const defs = svgRef.current.querySelector("defs");
      if (!defs) return;

      // Remove stale filter for this ID before injecting fresh markup
      const old = defs.querySelector(`#${filterIdRef.current}`);
      if (old) old.remove();

      defs.innerHTML += filterMarkup;
    },
    [enabled, isNative, bakeDisplacementMap, buildFilter]
  );

  // ─── 5. LIFECYCLE: MOUNT / UNMOUNT ─────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;

    // ── 5a. Inject hidden SVG portal into <body> ─────────────────────────────
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute(
      "style",
      "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;"
    );
    const defs = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "defs"
    );
    svg.appendChild(defs);
    document.body.appendChild(svg);
    svgRef.current = svg;

    // ── 5b. Apply filter (native) or fallback backdrop-filter (Safari/FF) ───
    const el = targetRef.current;
    if (!el) return;

    if (isNative) {
      el.style.filter = `url(#${filterIdRef.current})`;
    } else {
      // Frosted glass fallback — high density blur + saturation boost
      el.style.backdropFilter = "blur(16px) saturate(1.5)";
      el.style.webkitBackdropFilter = "blur(16px) saturate(1.5)";
    }

    // ── 5c. ResizeObserver: debounce on physical size change only ───────────
    if (isNative) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { offsetWidth: w, offsetHeight: h } = entry.target;
          // ONLY rebake if dimensions actually changed — position moves skip this
          if (
            w !== lastSizeRef.current.w ||
            h !== lastSizeRef.current.h
          ) {
            lastSizeRef.current = { w, h };
            rebake(w, h);
          }
        }
      });

      ro.observe(el);
      roRef.current = ro;

      // Initial bake
      const { offsetWidth: w, offsetHeight: h } = el;
      lastSizeRef.current = { w, h };
      rebake(w, h);
    }

    // ── 5d. Cleanup ──────────────────────────────────────────────────────────
    return () => {
      if (roRef.current) {
        roRef.current.disconnect();
        roRef.current = null;
      }
      if (svgRef.current && document.body.contains(svgRef.current)) {
        document.body.removeChild(svgRef.current);
        svgRef.current = null;
      }
      if (el) {
        el.style.filter = "";
        el.style.backdropFilter = "";
        el.style.webkitBackdropFilter = "";
      }
    };
  }, [enabled, isNative, rebake]);

  return {
    ref: targetRef,
    filterId: filterIdRef.current,
    isNative,
  };
}
