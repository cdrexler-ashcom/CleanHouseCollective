"use client";

import { useEffect, useState } from "react";

/**
 * Slim reading-progress bar fixed to the very top of the page. Updates on scroll
 * via requestAnimationFrame (throttled) so it stays smooth on mobile.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(scrollTop / height, 1) : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-emerald via-sage to-emerald-light"
      style={{
        transform: `scaleX(${progress})`,
        transition: "transform 80ms linear",
      }}
    />
  );
}
