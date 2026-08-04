import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.strangerverse.online"),

  title: {
    default: "StrangerVerse – Anonymous global chat for text, voice and video",
    template: "%s | StrangerVerse",
  },

  description:
    "Meet strangers instantly on StrangerVerse through anonymous text, voice and video conversations designed to feel premium, private, and effortless.",

  keywords: [
    "StrangerVerse",
    "anonymous random chat",
    "random stranger chat",
    "chat with strangers",
    "anonymous text chat",
    "anonymous voice chat",
    "anonymous video chat",
    "voice chat",
    "video chat",
    "meet strangers online",
    "talk to strangers",
    "global chat",
    "free stranger chat",
    "online stranger chat",
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
    apple: "/favicon.svg",
  },

  openGraph: {
    title: "StrangerVerse – Anonymous global chat for text, voice and video",
    description:
      "Meet strangers instantly through anonymous text, voice and video chat with people from around the world.",
    url: "https://www.strangerverse.online",
    siteName: "StrangerVerse",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "StrangerVerse",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "StrangerVerse – Anonymous global chat for text, voice and video",
    description:
      "Meet strangers instantly through anonymous text, voice and video chat with people worldwide.",
    images: ["/og-image.svg"],
  },
};

export const viewport = {
  themeColor: "#050816",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="min-h-screen bg-[#050816] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
