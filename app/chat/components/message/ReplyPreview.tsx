type ReplyPreviewProps = {
  message: string;
  isVisible: boolean;
  darkMode: boolean;
};

export function ReplyPreview({ message, isVisible, darkMode }: ReplyPreviewProps) {
  if (!isVisible) return null;

  return (
    <div className={`absolute left-0 top-12 max-w-[220px] rounded-xl border border-[rgba(255,255,255,0.08)] px-3 py-2 text-sm shadow-[0_20px_50px_rgba(0,0,0,0.26)] ${darkMode ? "bg-[#0F172A] text-slate-100" : "border-[rgba(255,255,255,0.08)] bg-[#0F172A] text-slate-100"}`}>
      <p className="font-medium">Replying to</p>
      <p className="truncate">{message}</p>
    </div>
  );
}
