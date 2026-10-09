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
  // Declares that the site supports both schemes so mobile browsers do not
  // apply their own forced dark mode on top of ours.
  colorScheme: "light dark",
  themeColor: "#0D4F45",
};

const THEME_SCRIPT = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem('theme')}catch(e){}if(t!=='dark'&&t!=='light'){t=null;try{var m=document.cookie.match(/(?:^|; )theme=(dark|light)/);if(m)t=m[1]}catch(e){}}if(!t){try{t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){t='light'}}if(t==='dark')d.classList.add('dark');d.style.colorScheme=t;})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the inline script below adds the `dark` class
    // and colour-scheme to <html> before React hydrates, so they intentionally
    // differ from the server markup.
    <html
      lang="en-AU"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved (localStorage, then cookie) or system theme before
            first paint so there is no flash or late switch. Keep in sync with
            lib/theme.ts. */}
        <script
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
      </head>
      <body>
        {/* If JS is disabled, reveal all scroll-animated content immediately. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
