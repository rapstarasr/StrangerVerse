import type { Metadata } from "next";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "Chat | StrangerVerse",
  description:
    "Jump into private anonymous chat with strangers using text, voice, and video on StrangerVerse.",
  openGraph: {
    title: "Chat | StrangerVerse",
    description:
      "Join StrangerVerse to chat with strangers instantly in anonymous text, voice, and video sessions.",
    url: "https://www.strangerverse.online/chat",
    siteName: "StrangerVerse",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "StrangerVerse Chat",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat | StrangerVerse",
    description:
      "Join StrangerVerse to chat with strangers instantly in anonymous text, voice, and video sessions.",
    images: ["/og-image.svg"],
  },
};

export default function ChatPage() {
  return <ChatClient />;
}
