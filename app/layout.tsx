import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "StrangerVerse",
      url: "https://www.strangerverse.online",
      logo: "https://www.strangerverse.online/logo.png",
    },
    {
      "@type": "WebSite",
      url: "https://www.strangerverse.online",
      name: "StrangerVerse",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.strangerverse.online/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.strangerverse.online"),

  title: {
    default: "StrangerVerse – Anonymous global chat for text, voice and video",
    template: "%s | StrangerVerse",
  },

  description:
    "StrangerVerse is an anonymous chat platform for text, voice, and video, with instant guest access and privacy-first design.",

  keywords: [
    "StrangerVerse",
    "anonymous chat",
    "anonymous voice chat",
    "anonymous video chat",
    "stranger chat",
    "random chat",
    "online chat",
    "text chat",
    "voice conversations",
    "video conversations",
    "meet strangers online",
  ],

  authors: [{ name: "StrangerVerse" }],
  creator: "StrangerVerse",
  publisher: "StrangerVerse",
  applicationName: "StrangerVerse",
  category: "Communication",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://www.strangerverse.online",
  },

  manifest: "/manifest.json",

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "StrangerVerse – Anonymous global anonymous chat for text, voice and video",
    description:
      "A premium global anonymous chat experience for strangers who want privacy and connection.",
    url: "https://www.strangerverse.online",
    siteName: "StrangerVerse",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "StrangerVerse Open Graph Image",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "StrangerVerse – Anonymous global anonymous chat for text, voice and video",
    description:
      "A premium global anonymous chat experience for strangers who want privacy and connection.",
    images: ["/og-image.svg"],
    creator: "@StrangerVerse",
  },
};

export const viewport = {
  themeColor: "#090B17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="min-h-screen antialiased">
        <Script id="theme-script" strategy="beforeInteractive">
          {`(function() {
            const themeKey = 'theme-preference';
            const stored = window.localStorage.getItem(themeKey);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            const resolved = stored === 'light' || stored === 'dark' ? stored : prefersDark.matches ? 'dark' : 'light';
            document.documentElement.dataset.theme = resolved;
            if (stored !== 'light' && stored !== 'dark') {
              prefersDark.addEventListener('change', (event) => {
                document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
              });
            }
          })();`}
        </Script>
        {children}
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify(structuredData)}
        </Script>
      </body>
    </html>
  );
}
