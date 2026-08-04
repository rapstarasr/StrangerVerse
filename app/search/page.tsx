import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | StrangerVerse",
  description:
    "Search for help topics, support articles, and information about StrangerVerse’s anonymous chat experience.",
};

export default function SearchPage() {
  return (
    <main className="bg-[#050816] text-white">
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Search</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Search StrangerVerse resources.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
          Use this page to find FAQs, policies, and guidance about anonymous chat, voice, and video features.
        </p>
        <div className="mt-12 rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(15,23,42,0.25)]">
          <p className="text-slate-300">
            This page is a placeholder for your searchable content and structured data. It supports the metadata required by site search engines and rich results.
          </p>
        </div>
      </section>
    </main>
  );
}
