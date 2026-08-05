type CallTimerProps = {
  startedAt: number | null;
  darkMode: boolean;
};

export function CallTimer({ startedAt, darkMode }: CallTimerProps) {
  return (
    <div className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0F172A]/90 px-3 py-1 text-sm font-medium text-slate-200">
      <span>{startedAt ? "00:00" : "Not connected"}</span>
    </div>
  );
}
