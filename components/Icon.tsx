/**
 * Lightweight inline SVG icon set (no external icon library dependency).
 * Add new icons by extending the `paths` map below.
 */

type IconProps = {
  name: string;
  className?: string;
};

const paths: Record<string, React.ReactNode> = {
  sparkles: (
    <path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15l-1.9-4.1L5.5 9l4.6-1.4L12 3zM19 14l.9 2.2L22 17l-2.1.8L19 20l-.9-2.2L16 17l2.1-.8L19 14zM6 15l.7 1.7L8.5 17l-1.8.7L6 19.5l-.7-1.8L3.5 17l1.8-.3L6 15z" />
  ),
  shine: (
    <path d="M12 2v3m0 14v3m10-10h-3M5 12H2m15.07-7.07l-2.12 2.12M7.05 16.95l-2.12 2.12m14.14 0l-2.12-2.12M7.05 7.05L4.93 4.93M12 8a4 4 0 100 8 4 4 0 000-8z" />
  ),
  key: (
    <path d="M15 7a4 4 0 11-4.9 3.9L4 17v3h3l1-1h2l1-1v-2l1.1-1.1A4 4 0 1115 7zm2-1a1 1 0 100 2 1 1 0 000-2z" />
  ),
  box: <path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" />,
  calendar: (
    <path d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
  ),
  heart: (
    <path d="M12 21s-7.5-4.6-10-9.3C.5 8.4 2 5 5.3 5c2 0 3.3 1.2 4.2 2.5C10.4 6.2 11.7 5 13.7 5 17 5 18.5 8.4 17 11.7 14.5 16.4 12 21 12 21z" />
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.4-1.2a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" />
  ),
  mail: (
    <path d="M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1zm0 2l8 6 8-6" />
  ),
  mapPin: (
    <path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  clock: <path d="M12 7v5l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  shield: <path d="M12 3l8 3v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V6l8-3z" />,
  leaf: <path d="M4 20c8 0 16-4 16-16C12 4 4 8 4 20zm0 0c2-4 5-7 9-9" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  sun: (
    <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.66-6.66l-1.42 1.42M7.76 16.24l-1.42 1.42m11.32 0l-1.42-1.42M7.76 7.76L6.34 6.34M12 8a4 4 0 100 8 4 4 0 000-8z" />
  ),
  moon: <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  tag: (
    <path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0l-7.2-7.2A2 2 0 013 12V5a2 2 0 012-2h7a2 2 0 011.4.6l7.2 7.2a2 2 0 010 2.6zM7.5 7.5h.01" />
  ),
  camera: (
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11zM12 17a4 4 0 100-8 4 4 0 000 8z" />
  ),
  upload: (
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  ),
  trash: (
    <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6h14z" />
  ),
  image: (
    <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 12l4-4 3 3 4-5 3 4M9 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  ),
};

export function Icon({ name, className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.sparkles}
    </svg>
  );
}
