'use client';

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  MessageCircleMore,
  Mic,
  Play,
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
} from "lucide-react";
import { useState } from "react";

const featureCards = [
  {
    title: "Anonymous chat",
    description: "Send messages without sharing your name, email, or profile details.",
    icon: MessageCircleMore,
  },
  {
    title: "Voice calling",
    description: "Start spontaneous audio conversations from the same anonymous room.",
    icon: Mic,
  },
  {
    title: "Video calling",
    description: "Switch to video when you want a closer, more natural connection.",
    icon: Video,
  },
  {
    title: "Media sharing",
    description: "Share files and images directly in the chat experience.",
    icon: Sparkles,
  },
  {
    title: "Skip / Next chat",
    description: "Leave a conversation and match with a new stranger instantly.",
    icon: ArrowRight,
  },
  {
    title: "Privacy first",
    description: "Default privacy settings keep your identity separate from every room.",
    icon: ShieldCheck,
  },
];

const processSteps = [
  { title: "Open StrangerVerse", description: "Visit the chat lounge and choose Guest mode to join without signing up." },
  { title: "Get matched instantly", description: "Connect with a stranger using anonymous matching and a quick join flow." },
  { title: "Start chatting", description: "Use text, voice, or video within the same anonymous session." },
];

const guestVsAccount = [
  {
    title: "Guest",
    items: [
      "No registration required",
      "Instant anonymous access",
      "Begin chatting in seconds",
    ],
  },
  {
    title: "Account",
    items: [
      "Friends (Coming Soon)",
      "Chat history (Coming Soon)",
      "Premium features (Coming Soon)",
    ],
    note: "Account features are planned and clearly marked as Coming Soon.",
  },
];

const faqs = [
  {
    question: "Do I need an account to use StrangerVerse?",
    answer: "No. You can start instantly in Guest mode without creating an account or sharing personal details.",
  },
  {
    question: "Is StrangerVerse free to use?",
    answer: "Yes. Anonymous text, voice, and video chat is available without a paid subscription.",
  },
  {
    question: "Can I stay anonymous while chatting?",
    answer: "Yes. The platform is designed to keep your identity separate from the chat experience.",
  },
  {
    question: "Can I report someone if needed?",
    answer: "Yes. The interface includes simple controls for reporting or leaving a conversation quickly.",
  },
  {
    question: "Does StrangerVerse support voice and video?",
    answer: "Yes. You can use voice and video within the same anonymous chat session.",
  },
];

const benefitCards = [
  {
    title: "Guest access",
    description: "Join without signing up and start chatting instantly.",
  },
  {
    title: "Text, voice, video",
    description: "Use the format that fits the moment in the same session.",
  },
  {
    title: "Skip or rematch",
    description: "Leave a conversation at any time and connect with someone new.",
  },
  {
    title: "Privacy first",
    description: "Designed to keep your identity separate from chat.",
  },
];

export default function HomeClient() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.22),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(135deg,_#030712_0%,_#09090f_45%,_#120323_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_40%,rgba(255,255,255,0.04)_75%,transparent)] opacity-60" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.28em] text-slate-100 uppercase">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
              <Sparkles size={18} />
            </span>
            StrangerVerse
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#safety" className="transition hover:text-white">Safety</a>
            <a href="#about" className="transition hover:text-white">About</a>
            <a href="#faq" className="transition hover:text-white">FAQ</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_40px_rgba(168,85,247,0.33)] transition hover:scale-[1.02]"
            >
              Start chatting
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-100 shadow-[0_0_35px_rgba(217,70,239,0.18)]">
            <Zap size={16} />
            Premium anonymous matching for curious minds
          </div>

          <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
            Talk to strangers around the world with calm confidence.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
            Start anonymous text, voice, or video conversations instantly in Guest mode, with privacy-first matching and zero signup.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Start chatting
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur"
            >
              <Play size={16} />
              Learn more
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-400">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <CheckCircle2 size={16} className="text-cyan-300" />
              Private and secure by design
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
              <CheckCircle2 size={16} className="text-fuchsia-300" />
              Fast, global, real-time connections
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-500/25 via-cyan-400/15 to-fuchsia-500/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/70 p-6 shadow-[0_0_90px_rgba(94,234,212,0.16)] backdrop-blur-2xl">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-cyan-400/20 via-transparent to-fuchsia-400/20" />
            <div className="relative grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <div className="text-sm text-cyan-200">Guest access</div>
                <div className="mt-3 text-3xl font-semibold text-white">No signup needed</div>
                <div className="mt-2 text-sm text-slate-300">Jump into anonymous chat instantly.</div>
              </div>
              <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 p-5">
                <div className="text-sm text-fuchsia-200">Anonymous rooms</div>
                <div className="mt-3 text-3xl font-semibold text-white">Private chat sessions</div>
                <div className="mt-2 text-sm text-slate-300">Each connection stays separate from your identity.</div>
              </div>
              <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Connection pulse</div>
                    <div className="mt-1 text-xl font-semibold text-white">Under 2 seconds to match</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    Stable
                  </div>
                </div>

                <div className="mt-4 flex items-end gap-2">
                  {[48, 72, 64, 92, 76, 100].map((height, index) => (
                    <div key={height} className="flex-1 rounded-full bg-gradient-to-t from-violet-500 to-cyan-400" style={{ height: `${height}px`, opacity: 0.45 + index * 0.08 }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/40 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          {benefitCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
              <div className="text-xl font-semibold text-white">{card.title}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{card.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Features</div>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">A premium room for genuine connection.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">Every surface is shaped for clarity, comfort, and effortless discovery.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/8 p-6 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-[0_0_90px_rgba(15,23,42,0.3)] backdrop-blur-xl lg:p-12">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.32em] text-fuchsia-300">How StrangerVerse works</div>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">A beautifully simple path from hello to real connection.</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">Three effortless steps guide every conversation, so the experience feels light and intuitive from the first tap.</p>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-6 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400/70 to-fuchsia-400/0" />
              {processSteps.map((step, index) => (
                <div key={step.title} className="relative pl-10 pb-8 last:pb-0">
                  <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-slate-900 text-sm font-semibold text-cyan-200">
                    0{index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="safety" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 p-8 backdrop-blur-xl">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Safety</div>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Built to feel secure without feeling stiff.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">You remain in control, with thoughtful protections and quick tools for reporting or stepping away whenever needed.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Privacy protection", "Anonymous defaults keep your identity shielded while you explore."],
              ["Session moderation", "Signals and safeguards help keep the space welcoming."],
              ["Report abuse", "One-tap pathways make it easy to act quickly when needed."],
              ["Secure conversations", "The experience is optimized for clarity, trust, and comfort."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-6 backdrop-blur">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-cyan-300">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Guest vs account</div>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Start anonymously now or see what account features are coming.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">Guest mode is available today. Account features are clearly marked as Coming Soon.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {guestVsAccount.map((option, index) => (
            <motion.div
              key={option.title}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-[1.75rem] border border-white/10 bg-white/8 p-8 backdrop-blur-xl"
            >
              <h3 className="text-xl font-semibold text-white">{option.title}</h3>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {option.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {option.note ? <p className="mt-6 text-sm text-slate-400">{option.note}</p> : null}
            </motion.div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">FAQ</div>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Questions from curious first-timers.</h2>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={item.question} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/8 backdrop-blur-xl">
                <button
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                >
                  <span className="text-lg font-semibold text-white">{item.question}</span>
                  <ChevronDown className={`transition ${isOpen ? "rotate-180 text-cyan-300" : "text-slate-400"}`} size={20} />
                </button>
                {isOpen ? <p className="px-6 pb-6 text-sm leading-7 text-slate-300">{item.answer}</p> : null}
              </div>
            );
          })}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-cyan-500/15 p-8 text-center shadow-[0_0_90px_rgba(94,234,212,0.14)] backdrop-blur-xl lg:p-12">
          <div className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Ready to meet someone new?</div>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Step into StrangerVerse and let the next conversation begin.</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/chat" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]">
              Start chatting now
              <ArrowRight size={16} />
            </Link>
            <a href="mailto:hello@strangerverse.online" className="rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur">
              Contact support
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <Sparkles size={18} />
            </span>
            <div>
              <div className="font-semibold text-slate-100">StrangerVerse</div>
              <div>Anonymous connections, reimagined.</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="transition hover:text-white">About</Link>
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <Link href="/faq" className="transition hover:text-white">FAQ</Link>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
          </div>
          <div className="text-sm text-slate-500">v0.1.0 · © 2026 StrangerVerse. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
