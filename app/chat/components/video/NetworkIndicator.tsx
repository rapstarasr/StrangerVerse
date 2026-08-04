type NetworkIndicatorProps = {
  quality: number;
  darkMode: boolean;
  label: string;
};

export function NetworkIndicator({ quality, darkMode, label }: NetworkIndicatorProps) {
  const tone = quality >= 4 ? "bg-emerald-500" : quality === 3 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${darkMode ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-300 bg-white text-slate-700"}`}>
      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      <span>{label}</span>
    </div>
  );
}
