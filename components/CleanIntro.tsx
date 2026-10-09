"use client";

import { useEffect, useState } from "react";

const PASSES = 4;
// Keep in sync with the timing variables in globals.css (.chc-intro).
const TOTAL_MS = 3900;

// A round string-mop head: two rings of strands radiating from the hub. The
// uneven lengths give the shaggy outline. Lengths are % of the head diameter.
const STRANDS_PER_RING = 24;
const strands = (offsetDeg: number, base: number, ring: "back" | "front") =>
  Array.from({ length: STRANDS_PER_RING }, (_, i) => ({
    ring,
    angle: offsetDeg + (i * 360) / STRANDS_PER_RING,
    len: base + ((i * 7) % 5) * 2,
  }));
const MOP_STRANDS = [...strands(7.5, 38, "back"), ...strands(0, 41, "front")];

// Water flicked over the top of the mop. x = px offset from the head centre,
// dx/dy = where it drifts (dx is "behind" the mop, flipped for right-to-left).
const DROPLETS = [
  { x: -18, s: 5, dx: -70, dy: -34, c: "#5aa9d6" },
  { x: -6, s: 4, dx: -110, dy: -48, c: "#8cc8ea" },
  { x: 8, s: 6, dx: -140, dy: -28, c: "#4a95c4" },
  { x: -28, s: 3, dx: -90, dy: -58, c: "#a9d8f0" },
  { x: 16, s: 5, dx: -160, dy: -40, c: "#6fb6df" },
  { x: 2, s: 4, dx: -60, dy: -52, c: "#5aa9d6" },
];

/**
 * First-load intro: the page starts covered in "grime" and a mop wipes it
 * away in a few alternating passes (left to right, right to left, ...), so the
 * page is revealed band by band. The mop enters from, and exits off, the
 * side of the screen, flicking a little water over its top as it goes.
 *
 * The overlay is server-rendered so there is no flash of unveiled content, and
 * the animation is pure CSS (see `.chc-intro` in globals.css). This component
 * only unmounts the overlay once it has finished. It is skipped entirely under
 * `prefers-reduced-motion`.
 */
export function CleanIntro() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const t = window.setTimeout(() => setDone(true), reduced ? 0 : TOTAL_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div className="chc-intro" aria-hidden="true">
      {Array.from({ length: PASSES }, (_, i) => {
        const rtl = i % 2 === 1;
        return (
          <div
            key={i}
            className={`chc-band ${rtl ? "chc-rtl" : "chc-ltr"}`}
            style={{ ["--i" as any]: i, ["--n" as any]: PASSES }}
          >
            <div className="chc-cover" />
            <div className="chc-mop">
              <div className="chc-mop-flip">
                <span className="chc-head">
                  <span className="chc-foam" />
                  {MOP_STRANDS.map((st, n) => (
                    <i
                      key={n}
                      className={`chc-strand chc-strand-${st.ring}`}
                      style={{
                        ["--a" as any]: `${st.angle}deg`,
                        ["--len" as any]: `${st.len}%`,
                      }}
                    />
                  ))}
                  <span className="chc-handle" />
                  <span className="chc-hub" />
                  {DROPLETS.map((d, k) => (
                    <span
                      key={k}
                      className="chc-droplet"
                      style={{
                        ["--k" as any]: k,
                        ["--x" as any]: `${d.x}px`,
                        ["--s" as any]: `${d.s}px`,
                        ["--dx" as any]: `${d.dx}px`,
                        ["--dy" as any]: `${d.dy}px`,
                        ["--c" as any]: d.c,
                      }}
                    />
                  ))}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
