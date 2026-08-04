import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | StrangerVerse",
  description:
    "Read StrangerVerse's privacy policy to understand how anonymous chat data is handled and protected.",
};

const sections = [
  {
    title: "No personal accounts required",
    content:
      "You can use StrangerVerse without creating a personal account, keeping your identity separate from the chat experience.",
  },
  {
    title: "Safe usage of messages",
    content:
      "We process chat data to support the experience, but we do not store unnecessary personal details or share data with third parties for advertising.",
  },
  {
    title: "Secure file uploads",
    content:
      "Attachments are handled through secure uploads and served from trusted assets, with safeguards against misuse.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-[#050816] text-white">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Privacy Policy</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Your privacy matters at StrangerVerse.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
          We design anonymous conversation experiences that minimize sensitive data collection while preserving the real-time chat experience.
        </p>
        <div className="mt-14 space-y-10">
          {sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(15,23,42,0.25)]">
              <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
              <p className="mt-4 text-slate-300">{section.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
