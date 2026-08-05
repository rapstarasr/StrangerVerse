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

      <aside className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs transform border-r border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] p-5 shadow-2xl transition-transform duration-300 md:static md:translate-x-0 md:h-screen md:w-80 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-500">Anonymous room</p>
            <h1 className="mt-3 text-3xl font-bold text-[color:var(--foreground)] md:text-4xl">StrangerVerse</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)] md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 rounded-[32px] bg-[color:var(--surface-muted)]/80 p-5 ring-1 ring-[color:var(--border)] shadow-[0_24px_60px_rgba(15,23,42,0.15)]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-600 to-violet-500 text-white shadow-[0_20px_40px_rgba(168,85,247,0.25)]">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Instant matches</p>
              <p className="mt-2 text-base font-semibold text-[color:var(--foreground)]">Find a stranger in seconds.</p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-[color:var(--surface)] p-4 text-sm text-slate-600 shadow-inner shadow-[color:var(--shadow)]">
            <div className="flex items-center gap-3">
              <Users2 className="h-5 w-5 text-cyan-500" />
              <span className="font-medium">{onlineUsers} people online</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-violet-500" />
              <span className="text-slate-500">Private anonymous chat</span>
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
            className="inline-flex h-14 items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] text-sm font-semibold text-[color:var(--foreground)] transition hover:border-violet-400 hover:text-violet-600"
          >
            ⏭ Next
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onVoiceCall}
            className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3 text-left text-sm font-medium text-[color:var(--foreground)] transition hover:border-emerald-400 hover:text-emerald-600"
          >
            <div className="font-semibold">🎙 Voice Call</div>
            <p className="mt-1 text-xs text-slate-500">Quick audio rooms</p>
          </button>
          <button
            type="button"
            onClick={onVideoCall}
            className="rounded-3xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-left text-sm font-medium text-violet-700 transition hover:bg-violet-500/20"
          >
            <div className="font-semibold">📹 Video Call</div>
            <p className="mt-1 text-xs text-slate-500">Instant video match</p>
          </button>
        </div>

        <div className="mt-8 grid gap-3 text-sm text-slate-800 sm:grid-cols-2">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
            <p className="text-slate-500">Online users</p>
            <p className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">{onlineUsers}</p>
          </div>
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm">
            <p className="text-slate-500">Status</p>
            <p className="mt-3 text-3xl font-semibold text-emerald-500">{status}</p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-4 text-sm text-slate-500">
          <p className="font-semibold text-[color:var(--foreground)]">Premium mobile hub</p>
          <p className="mt-2 leading-6">Tap outside the drawer to close it and stay focused on the chat feed.</p>
        </div>
      </aside>
    </>
  );
}
