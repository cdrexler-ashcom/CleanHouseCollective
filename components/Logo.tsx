import { site } from "@/data/site";
import { LogoMark } from "./LogoMark";

/**
 * Brand logo. Uses the inlined vector house-mark (LogoMark) presented on a soft,
 * rounded cream chip so it renders instantly (no network request, never blank)
 * and blends nicely anywhere. `showText` optionally shows the business name.
 */
export function Logo({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-cream p-2 text-emerald shadow-soft ring-1 ring-black/5 transition-transform duration-300 hover:scale-105">
        <LogoMark className="h-full w-full" />
      </span>
      {showText && (
        <span className="font-display text-lg font-bold leading-none tracking-tight">
          {site.name}
        </span>
      )}
    </div>
  );
}
