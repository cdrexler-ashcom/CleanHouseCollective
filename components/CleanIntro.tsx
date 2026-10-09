"use client";

import { useEffect, useState } from "react";

const PASSES = 4;
// Keep in sync with the timing variables in globals.css (.chc-intro).
const TOTAL_MS = 3600;

/**
 * First-load intro: the page starts covered in "grime" and a mop wipes it
 * away in a few alternating passes (left to right, right to left, ...), so the
 * page is revealed band by band.
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
                <span className="chc-foam" />
                <svg
                  className="chc-mop-svg"
                  viewBox="0 0 100 150"
                  width="110"
                  height="165"
                >
                  <line
                    x1="80"
                    y1="0"
                    x2="46"
                    y2="96"
                    stroke="#8a6a3f"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <rect x="31" y="90" width="30" height="9" rx="3" fill="#6B8C6F" />
                  {[0, 1, 2, 3, 4, 5, 6].map((s) => (
                    <g key={s}>
                      <line
                        x1={34 + s * 4}
                        y1="98"
                        x2={22 + s * 8}
                        y2="140"
                        stroke="#86A88A"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />
                      <line
                        x1={34 + s * 4}
                        y1="98"
                        x2={22 + s * 8}
                        y2="140"
                        stroke="#FAFAF7"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
