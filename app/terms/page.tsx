import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | StrangerVerse",
  description:
    "Review the StrangerVerse terms of service for acceptable use, moderation, and anonymous chat policies.",
};

const terms = [
  {
    title: "Use responsibly",
    content:
      "StrangerVerse is for safe, anonymous connection. Abuse, harassment, and illegal behavior are not permitted.",
  },
  {
    title: "No account obligations",
    content:
      "Since the service is built for anonymous connection, we do not require user accounts or collect unnecessary personal data.",
  },
  {
    title: "Content moderation",
    content:
      "We reserve the right to remove content or disconnect sessions that violate community standards or safety guidelines.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-[#050816] text-white">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Terms of Service</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Terms for using StrangerVerse safely and responsibly.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
          These terms describe how StrangerVerse operates and what you can expect from the anonymous chat experience.
        </p>
        <div className="mt-14 space-y-10">
          {terms.map((term) => (
            <article key={term.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(15,23,42,0.25)]">
              <h2 className="text-2xl font-semibold text-white">{term.title}</h2>
              <p className="mt-4 text-slate-300">{term.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
