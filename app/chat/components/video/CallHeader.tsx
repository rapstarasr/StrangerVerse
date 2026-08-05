type CallHeaderProps = {
  title: string;
  status: string;
  darkMode: boolean;
  connectionState: string;
};

export function CallHeader({ title, status, darkMode, connectionState }: CallHeaderProps) {
  const textClass = "text-slate-100";
  const mutedClass = "text-slate-400";

  return (
    <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] bg-[#0B1222] px-4 py-3">
      <div>
        <p className={`text-sm font-semibold ${textClass}`}>{title}</p>
        <p className={`text-xs ${mutedClass}`}>{status}</p>
      </div>
      <div className="rounded-full border border-[rgba(139,92,246,0.24)] bg-[rgba(139,92,246,0.12)] px-3 py-1 text-xs font-medium text-[#22D3EE]">
        {connectionState}
      </div>
    </div>
  );
}
