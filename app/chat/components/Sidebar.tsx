"use client";

import { ShieldCheck, Sparkles, Users2, X } from "lucide-react";

type SidebarProps = {
  onlineUsers: number;
  status: string;
  onFindStranger: () => void;
  onNext: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  onlineUsers,
  status,
  onFindStranger,
  onNext,
  onVoiceCall,
  onVideoCall,
  isOpen = false,
  onClose,
}: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xl transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs transform border-r border-slate-800 bg-slate-950 text-white p-5 shadow-2xl transition-transform duration-300 md:static md:translate-x-0 md:w-72 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between gap-4 md:block">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Anonymous room</p>
            <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">StrangerVerse</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 rounded-[32px] bg-slate-900/95 p-5 ring-1 ring-white/10 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-600 to-violet-500 text-white shadow-[0_20px_40px_rgba(168,85,247,0.25)]">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Instant matches</p>
              <p className="mt-2 text-base font-semibold text-white">Find a stranger in seconds.</p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300 shadow-inner shadow-slate-950/20">
            <div className="flex items-center gap-3">
              <Users2 className="h-5 w-5 text-cyan-300" />
              <span className="font-medium">{onlineUsers} people online</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-violet-400" />
              <span className="text-slate-400">Private anonymous chat</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3">
          <button
            onClick={onFindStranger}
            className="inline-flex h-14 items-center justify-center rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-500 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(79,70,229,0.3)] transition hover:-translate-y-0.5"
          >
            🔍 Find Stranger
          </button>
          <button
            onClick={onNext}
            className="inline-flex h-14 items-center justify-center rounded-3xl border border-slate-700 bg-slate-900 text-sm font-semibold text-white transition hover:border-violet-400 hover:text-violet-200"
          >
            ⏭ Next
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onVoiceCall}
            className="rounded-3xl border border-slate-800 bg-slate-900/85 px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-emerald-400 hover:text-white"
          >
            <div className="font-semibold">🎙 Voice Call</div>
            <p className="mt-1 text-xs text-slate-400">Quick audio rooms</p>
          </button>
          <button
            type="button"
            onClick={onVideoCall}
            className="rounded-3xl border border-violet-600/40 bg-violet-600/10 px-4 py-3 text-left text-sm font-medium text-violet-200 transition hover:bg-violet-600/20"
          >
            <div className="font-semibold">📹 Video Call</div>
            <p className="mt-1 text-xs text-slate-400">Instant video match</p>
          </button>
        </div>

        <div className="mt-8 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
            <p className="text-slate-400">Online users</p>
            <p className="mt-3 text-3xl font-semibold text-white">{onlineUsers}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm">
            <p className="text-slate-400">Status</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-300">{status}</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-400">
          <p className="font-semibold text-slate-100">Mobile navigation</p>
          <p className="mt-2 leading-6">Tap outside the drawer to close it, or use the menu button to reopen at any time.</p>
        </div>

        <div className="mt-6 text-sm text-slate-500">StrangerVerse v2</div>
      </aside>
    </>
  );
}
