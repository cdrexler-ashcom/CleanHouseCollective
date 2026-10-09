// A twinkling four-point sparkle. Decorative; animation is in globals.css.
export function Sparkle({
  className = "",
  delay = 0,
  size = 22,
}: {
  className?: string;
  delay?: number;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`sparkle pointer-events-none absolute ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <path
        fill="currentColor"
        d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z"
      />
    </svg>
  );
}
