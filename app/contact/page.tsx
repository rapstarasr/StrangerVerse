import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | StrangerVerse",
  description:
    "Contact StrangerVerse support for questions about anonymous chat, safety, or deployment.",
};

export default function ContactPage() {
  return (
    <main className="bg-[#050816] text-white">
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Contact</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Get in touch with the StrangerVerse team.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
          Have a question about the anonymous chat experience, accessibility, or privacy? Reach out and we’ll respond promptly.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(15,23,42,0.25)]">
            <h2 className="text-2xl font-semibold text-white">Support</h2>
            <p className="mt-4 text-slate-300">Email us at <a href="mailto:support@strangerverse.online" className="text-cyan-300 underline">support@strangerverse.online</a> for help with the application.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(15,23,42,0.25)]">
            <h2 className="text-2xl font-semibold text-white">Feedback</h2>
            <p className="mt-4 text-slate-300">Share product ideas, ask about planned features, or report issues with the experience.</p>
            <p className="mt-4 text-slate-300">Visit our <Link href="/faq" className="text-cyan-300 underline">FAQ</Link> for common questions.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
