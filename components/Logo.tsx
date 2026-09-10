import Image from "next/image";
import { site } from "@/data/site";

/**
 * Brand logo. Uses the crisp vector house-mark (public/logo-mark.svg) presented
 * on a soft, rounded cream chip so it blends nicely anywhere while staying
 * readable. `showText` optionally shows the business name alongside it.
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
      <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-cream p-1.5 shadow-soft ring-1 ring-black/5 transition-transform duration-300 hover:scale-105">
        <Image
          src="/logo-mark.svg"
          alt={`${site.name} logo`}
          width={44}
          height={44}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      {showText && (
        <span className="font-display text-lg font-bold leading-none tracking-tight">
          {site.name}
        </span>
      )}
    </div>
  );
}
