type NetworkIndicatorProps = {
  quality: number;
  darkMode: boolean;
  label: string;
};

export function NetworkIndicator({ quality, darkMode, label }: NetworkIndicatorProps) {
  const tone = quality >= 4 ? "bg-emerald-500" : quality === 3 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0F172A] px-3 py-1 text-xs text-slate-200">
      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      <span>{label}</span>
    </div>
  );
}
