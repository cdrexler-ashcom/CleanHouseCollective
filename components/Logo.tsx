import Image from "next/image";
import { site } from "@/data/site";

/**
 * Brand logo. Uses the real Clean House Collective logo mark (public/logo.png).
 * `withWordmark` shows the business name alongside the mark (the logo image
 * already contains the words, so the text is hidden on very small screens to
 * avoid duplication when needed).
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
      <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-soft">
        <Image
          src="/logo.png"
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
