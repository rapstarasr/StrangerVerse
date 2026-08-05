"use client";

import { Monitor, Moon, SunMedium, X } from "lucide-react";

type ThemeMode = "system" | "light" | "dark";

type SidebarProps = {
  onlineUsers: number;
  status: string;
  onFindStranger: () => void;
  onNext: () => void;
  themeMode: ThemeMode;
  onThemeToggle: () => void;
  isOpen?: boolean;
  onClose?: () => void;
};

const getThemeIcon = (mode: ThemeMode) => {
  if (mode === "dark") return <Moon className="h-4 w-4" />;
  if (mode === "light") return <SunMedium className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
};

export default function Sidebar({
  onlineUsers,
  status,
  onFindStranger,
  onNext,
  themeMode,
  onThemeToggle,
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

      <aside className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs transform border-r border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] p-6 shadow-[0_35px_80px_rgba(0,0,0,0.35)] transition-transform duration-300 md:static md:translate-x-0 md:h-screen md:w-80 xl:w-96 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-400">StrangerVerse</p>
            <h1 className="mt-3 text-4xl font-bold text-[color:var(--foreground)]">StrangerVerse</h1>
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

        <div className="mt-8 space-y-4">
          <button
            onClick={onFindStranger}
            className="w-full rounded-[28px] bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#22D3EE] px-5 py-4 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(34,211,238,0.18)] transition hover:brightness-110"
          >
            🔍 Find Stranger
          </button>
          <button
            onClick={onNext}
            className="w-full rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-5 py-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[#8B5CF6] hover:text-[#8B5CF6]"
          >
            ⏭ Next Stranger
          </button>
        </div>

        <div className="mt-8 grid gap-3">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-4 text-sm shadow-sm">
            <p className="text-slate-400">Online users</p>
            <p className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">{onlineUsers}</p>
          </div>
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-4 text-sm shadow-sm">
            <p className="text-slate-400">Connection status</p>
            <p className="mt-3 text-2xl font-semibold text-[#22D3EE]">{status}</p>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={onThemeToggle}
            className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
          >
            {getThemeIcon(themeMode)}
            Theme
          </button>
        </div>
      </aside>
    </>
  );
}
