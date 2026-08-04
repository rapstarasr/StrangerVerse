type CallHeaderProps = {
  title: string;
  status: string;
  darkMode: boolean;
  connectionState: string;
};

export function CallHeader({ title, status, darkMode, connectionState }: CallHeaderProps) {
  const textClass = darkMode ? "text-slate-100" : "text-slate-900";
  const mutedClass = darkMode ? "text-slate-400" : "text-slate-600";

  return (
    <div className={`flex items-center justify-between border-b px-4 py-3 ${darkMode ? "border-slate-800 bg-slate-900/90" : "border-slate-200 bg-slate-50"}`}>
      <div>
        <p className={`text-sm font-semibold ${textClass}`}>{title}</p>
        <p className={`text-xs ${mutedClass}`}>{status}</p>
      </div>
      <div className={`rounded-full border px-3 py-1 text-xs font-medium ${darkMode ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-300 bg-white text-slate-700"}`}>
        {connectionState}
      </div>
    </div>
  );
}
