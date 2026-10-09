import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "cleaning",
    "domestic cleaning",
    "house cleaning",
    "Kallangur",
    "North Brisbane",
    "Moreton Bay",
    "South East Queensland",
    "flat rate cleaning",
    "regular house cleaning",
  ],
  openGraph: {
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "en_AU",
  },
  robots: { index: true, follow: true },
};

// Uses the device width and keeps pinch-zoom enabled for accessibility.
// `viewportFit: "cover"` lets us use the safe-area insets (notch / home
// indicator) in the camera modal.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D4F45",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        {/* Prevent dark-mode flash: applies saved/system theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        {/* If JS is disabled, reveal all scroll-animated content immediately. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
