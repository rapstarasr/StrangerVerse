import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | StrangerVerse",
  description:
    "Find answers to common questions about StrangerVerse’s anonymous chat, voice, video, and privacy features.",
};

const faqs = [
  {
    question: "Is StrangerVerse anonymous by default?",
    answer:
      "Yes. You can use StrangerVerse without providing personal information or signing up for an account.",
  },
  {
    question: "Can I switch between text, voice, and video?",
    answer:
      "Absolutely. StrangerVerse supports seamless transitions between chat, voice, and video within the same session.",
  },
  {
    question: "How is safety handled?",
    answer:
      "We use session-based matching and moderation-friendly design patterns to help keep conversations comfortable.",
  },
  {
    question: "Is StrangerVerse available on mobile?",
    answer:
      "Yes. The interface is responsive and works well across mobile, tablet, and desktop devices.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <main className="bg-[#050816] text-white">
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">FAQ</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Frequently asked questions about StrangerVerse.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
          Learn how the platform works and what to expect from the anonymous chat experience.
        </p>

        <div className="mt-14 space-y-6">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-[0_0_40px_rgba(15,23,42,0.25)]">
              <h2 className="text-2xl font-semibold text-white">{faq.question}</h2>
              <p className="mt-4 text-slate-300">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
