"use client";

type HeaderProps = {
  typing: boolean;
  onOpenSidebar?: () => void;
};

export default function Header({ typing, onOpenSidebar }: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/95 text-white backdrop-blur-md px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Anonymous lounge
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl">
                StrangerVerse
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Secure anonymous text, voice, and video chat with strangers. No signup required.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 shadow-sm shadow-slate-950/10">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.35)]" />
              Live connection
            </div>
          </div>
        </div>

        {onOpenSidebar ? (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10 md:hidden"
            aria-label="Open menu"
          >
            Menu
          </button>
        ) : null}
      </div>

      {typing && (
        <div className="mt-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100 shadow-sm shadow-emerald-500/5 md:mx-auto md:max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse delay-75" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse delay-150" />
            </div>
            <span className="font-medium">Stranger is typing…</span>
          </div>
        </div>
      )}
    </header>
  );
}