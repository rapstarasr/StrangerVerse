"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Monitor, Moon, Phone, SunMedium, Video, MoreVertical } from "lucide-react";

type ThemeMode = "system" | "light" | "dark";

type HeaderProps = {
  typing: boolean;
  onOpenSidebar?: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onlineUsers: number;
  status: string;
};

const themeCycle: ThemeMode[] = ["system", "dark", "light"];

export default function Header({ typing, onOpenSidebar, onVoiceCall, onVideoCall, onlineUsers, status }: HeaderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    const stored = window.localStorage.getItem("theme-preference");
    return stored === "dark" || stored === "light" || stored === "system" ? stored : "system";
  });

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    const resolvedTheme = themeMode === "dark" ? "dark" : themeMode === "light" ? "light" : prefersDark.matches ? "dark" : "light";
    document.documentElement.dataset.theme = resolvedTheme;
    window.localStorage.setItem("theme-preference", themeMode);
  }, [themeMode]);

  const getThemeIcon = () => {
    if (themeMode === "dark") return <Moon className="h-4 w-4" />;
    if (themeMode === "light") return <SunMedium className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const nextTheme = () => {
    setThemeMode(themeCycle[(themeCycle.indexOf(themeMode) + 1) % themeCycle.length]);
  };

  const themeLabel = themeMode === "dark" ? "Dark" : themeMode === "light" ? "Light" : "System";

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[color:var(--surface)]/95 text-[color:var(--foreground)] backdrop-blur-xl px-4 py-4 shadow-sm shadow-[color:var(--shadow)] sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          {onOpenSidebar ? (
            <button
              type="button"
              onClick={onOpenSidebar}
              className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)] md:hidden"
              aria-label="Open sidebar"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : null}

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-500">Anonymous premium chat</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="rounded-full bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-600 ring-1 ring-violet-500/20">Stranger</div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-600 ring-1 ring-emerald-500/20">Live</div>
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-3xl">StrangerVerse</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Anonymous text, voice, and video chat in a premium messaging workspace.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onVoiceCall}
            className="inline-flex h-12 items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
            aria-label="Start voice call"
          >
            <Phone className="mr-2 h-4 w-4" />
            Voice
          </button>
          <button
            type="button"
            onClick={onVideoCall}
            className="inline-flex h-12 items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
            aria-label="Start video call"
          >
            <Video className="mr-2 h-4 w-4" />
            Video
          </button>
          <button
            type="button"
            onClick={nextTheme}
            className="inline-flex h-12 items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
            aria-label={`Switch theme, current ${themeLabel}`}
          >
            {getThemeIcon()}
            <span className="ml-2 hidden sm:inline">{themeLabel}</span>
          </button>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
            aria-label="More actions"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(180px,1fr)_minmax(220px,auto)]">
        <div className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-muted)]/90 px-4 py-4 text-sm text-slate-600 shadow-sm shadow-[color:var(--shadow)]">
          <p className="font-semibold text-[color:var(--foreground)]">{typing ? "Stranger is typing…" : "Matched conversations ready to begin."}</p>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-muted)]/90 px-4 py-4 text-sm shadow-sm shadow-[color:var(--shadow)]">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Online now</p>
            <p className="mt-2 text-base font-semibold text-[color:var(--foreground)]">{onlineUsers} users</p>
          </div>
          <div className="rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-700">
            {status}
          </div>
        </div>
      </div>
    </header>
  );
}
