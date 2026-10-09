// Soap bubbles drifting up through the hero background. Pure CSS (see
// `.bubble` in globals.css), decorative only, and hidden under reduced motion.
const BUBBLES = [
  { left: 6, size: 18, dur: 16, delay: 0, sway: 24 },
  { left: 14, size: 34, dur: 22, delay: 4, sway: -30 },
  { left: 23, size: 12, dur: 14, delay: 9, sway: 18 },
  { left: 33, size: 26, dur: 19, delay: 2, sway: -22 },
  { left: 44, size: 16, dur: 15, delay: 7, sway: 28 },
  { left: 52, size: 40, dur: 26, delay: 11, sway: -36 },
  { left: 61, size: 20, dur: 17, delay: 5, sway: 20 },
  { left: 70, size: 30, dur: 21, delay: 1, sway: -26 },
  { left: 79, size: 14, dur: 13, delay: 8, sway: 16 },
  { left: 87, size: 24, dur: 18, delay: 3, sway: -20 },
  { left: 94, size: 36, dur: 24, delay: 10, sway: 32 },
];

export function Bubbles() {
  return (
    <div
      aria-hidden="true"
      className="bubbles pointer-events-none absolute inset-0 overflow-hidden"
    >
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
            ["--sway" as any]: `${b.sway}px`,
          }}
        />
      ))}
    </div>
  );
}
