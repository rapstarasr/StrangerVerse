"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Monitor, Moon, Phone, SunMedium, Video, MoreVertical, Users2 } from "lucide-react";

type ThemeMode = "system" | "light" | "dark";

type HeaderProps = {
  typing: boolean;
  onOpenSidebar?: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onFindStranger: () => void;
  onNext: () => void;
  onlineUsers: number;
  status: string;
  themeMode: ThemeMode;
  onThemeToggle: () => void;
};

const getThemeIcon = (mode: ThemeMode) => {
  if (mode === "dark") return <Moon className="h-4 w-4" />;
  if (mode === "light") return <SunMedium className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
};

const statusLabel = (status: string) => (status.toLowerCase() === "online" ? "Online" : status);

export default function Header({
  typing,
  onOpenSidebar,
  onVoiceCall,
  onVideoCall,
  onFindStranger,
  onNext,
  onlineUsers,
  status,
  themeMode,
  onThemeToggle,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeLabel = themeMode === "dark" ? "Dark" : themeMode === "light" ? "Light" : "System";

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[color:var(--surface)]/95 text-[color:var(--foreground)] backdrop-blur-xl px-4 py-3 shadow-sm shadow-[color:var(--shadow)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onOpenSidebar ? (
            <button
              type="button"
              onClick={onOpenSidebar}
              className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)] md:hidden"
              aria-label="Open menu"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : null}

          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-500">
            <span className="text-lg font-semibold">S</span>
          </div>

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">StrangerVerse</p>
            <div className="truncate text-lg font-semibold text-[color:var(--foreground)]">Stranger</div>
            <p className="text-sm text-emerald-500">{statusLabel(status)}</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={onVoiceCall}
            className="inline-flex items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
            aria-label="Start voice call"
          >
            <Phone className="mr-2 h-4 w-4" />
            Voice
          </button>
          <button
            type="button"
            onClick={onVideoCall}
            className="inline-flex items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
            aria-label="Start video call"
          >
            <Video className="mr-2 h-4 w-4" />
            Video
          </button>
          <button
            type="button"
            onClick={onThemeToggle}
            className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
            aria-label={`Toggle theme, current ${themeLabel}`}
          >
            {getThemeIcon(themeMode)}
          </button>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
            aria-label="Open actions menu"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-xl">
              <div className="flex flex-col gap-1 p-3 text-left text-sm text-[color:var(--foreground)]">
                <button
                  type="button"
                  onClick={() => {
                    onFindStranger();
                    setMenuOpen(false);
                  }}
                  className="rounded-3xl px-3 py-2 text-left transition hover:bg-[color:var(--surface-muted)]"
                >
                  Find Stranger
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNext();
                    setMenuOpen(false);
                  }}
                  className="rounded-3xl px-3 py-2 text-left transition hover:bg-[color:var(--surface-muted)]"
                >
                  Next Stranger
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onThemeToggle();
                    setMenuOpen(false);
                  }}
                  className="rounded-3xl px-3 py-2 text-left transition hover:bg-[color:var(--surface-muted)]"
                >
                  Theme: {themeLabel}
                </button>
              </div>
              <div className="border-t border-[color:var(--border)] p-3 text-sm text-slate-500">
                <div className="mb-2 flex items-center gap-2 text-[color:var(--foreground)]">
                  <Users2 className="h-4 w-4 text-cyan-500" />
                  <span>{onlineUsers} online</span>
                </div>
                <div>{statusLabel(status)}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {typing ? (
        <div className="mt-3 flex items-center gap-2 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-slate-500">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-500" />
          <span>Stranger is typing…</span>
        </div>
      ) : null}
    </header>
  );
}
