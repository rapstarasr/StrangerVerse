"use client";

import { Activity, Sparkles, Users2, CircleDot, ArrowRight, ShieldCheck } from "lucide-react";

type WorkspacePanelProps = {
  onlineUsers: number;
  status: string;
  onFindStranger: () => void;
  onNext: () => void;
};

export default function WorkspacePanel({ onlineUsers, status, onFindStranger, onNext }: WorkspacePanelProps) {
  return (
    <aside className="hidden xl:flex xl:w-[320px] xl:flex-col xl:gap-6">
      <div className="sticky top-4 flex flex-col gap-6">
        <section className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_35px_80px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Workspace</p>
              <h2 className="mt-3 text-xl font-semibold text-[color:var(--foreground)]">Premium Chat</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[rgba(139,92,246,0.12)] text-[#8B5CF6] shadow-[0_18px_50px_rgba(139,92,246,0.16)]">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl bg-[color:var(--surface-muted)] p-4">
              <p className="text-sm text-slate-400">Connected now</p>
              <p className="mt-2 text-3xl font-semibold text-[color:var(--foreground)]">{onlineUsers}</p>
            </div>
            <div className="rounded-3xl bg-[color:var(--surface-muted)] p-4">
              <p className="text-sm text-slate-400">Connection status</p>
              <p className="mt-2 text-2xl font-semibold text-[#22D3EE]">{status}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-low)]">
          <div className="flex items-center gap-3 text-[color:var(--foreground)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[rgba(34,211,238,0.12)] text-[#22D3EE]">
              <Users2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Live loop</p>
              <p className="mt-2 text-base font-semibold">Stay in sync with strangers</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-400">
            <p className="rounded-3xl bg-[color:var(--surface-muted)] p-4">Easily jump between conversations with one tap and keep the workspace focused.</p>
            <p className="rounded-3xl bg-[color:var(--surface-muted)] p-4">Designed for fast anonymous matching and secure voice/video calls.</p>
          </div>
        </section>

        <section className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-low)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Quick actions</p>
              <p className="mt-2 text-base font-semibold text-[color:var(--foreground)]">Move faster</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-[rgba(139,92,246,0.12)] text-[#8B5CF6]">
              <Activity className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={onFindStranger}
              className="flex items-center justify-between rounded-3xl bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <span>Find Stranger</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
            >
              Next Stranger
            </button>
          </div>
        </section>

        <section className="rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-low)]">
          <div className="flex items-center gap-3 text-[color:var(--foreground)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[rgba(34,211,238,0.12)] text-[#22D3EE]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Safety first</p>
              <p className="mt-2 text-base font-semibold">Anonymous by design</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">StrangerVerse is built to keep every chat private, lightweight, and easy to jump in without friction.</p>
        </section>
      </div>
    </aside>
  );
}
