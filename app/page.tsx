import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "StrangerVerse — Anonymous guest chat for text, voice, and video",
  description:
    "Start anonymous text, voice, or video conversations instantly in Guest mode, with privacy-first matching and zero signup.",
  openGraph: {
    title: "StrangerVerse — Anonymous guest chat for text, voice, and video",
    description:
      "Start anonymous text, voice, or video conversations instantly in Guest mode, with privacy-first matching and zero signup.",
    url: "https://www.strangerverse.online",
    siteName: "StrangerVerse",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "StrangerVerse Open Graph Image",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StrangerVerse — Anonymous stranger chat for text, voice, and video",
    description:
      "StrangerVerse helps you meet strangers instantly with anonymous text, voice, and video conversations designed to feel safe, fast, and premium.",
    images: ["/og-image.svg"],
  },
};

export default function HomePage() {
  return <HomeClient />;
}
