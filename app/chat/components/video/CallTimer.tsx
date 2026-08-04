type CallTimerProps = {
  startedAt: number | null;
  darkMode: boolean;
};

export function CallTimer({ startedAt, darkMode }: CallTimerProps) {
  const textClass = darkMode ? "text-slate-200" : "text-slate-700";
  return (
    <div className={`rounded-full border px-3 py-1 text-sm font-medium ${darkMode ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-300 bg-white text-slate-700"}`}>
      <span className={textClass}>{startedAt ? "00:00" : "Not connected"}</span>
    </div>
  );
}
