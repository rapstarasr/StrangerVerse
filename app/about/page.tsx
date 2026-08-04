import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | StrangerVerse",
  description:
    "Discover how StrangerVerse connects strangers through anonymous text, voice, and video conversations with fast matchmaking and safety-first design.",
};

const values = [
  {
    title: "Anonymous matching",
    description:
      "StrangerVerse connects you with new people instantly, without requiring personal details or accounts.",
  },
  {
    title: "Flexible media",
    description:
      "Switch between text, voice, and video naturally in the same conversation with zero friction.",
  },
  {
    title: "Privacy-first experience",
    description:
      "Designed to keep your identity private while giving you control over every interaction.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#050816] text-white">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">About StrangerVerse</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
            A modern anonymous chat destination built for real conversations.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
            StrangerVerse helps curious people connect through private text, voice, and video conversations. We focus on speed, safety, and thoughtful interactions so every connection feels inviting.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              Contact support
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              View FAQ
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {values.map((item) => (
            <article key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_50px_rgba(15,23,42,0.25)]">
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-4 text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
