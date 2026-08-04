type ReplyPreviewProps = {
  message: string;
  isVisible: boolean;
  darkMode: boolean;
};

export function ReplyPreview({ message, isVisible, darkMode }: ReplyPreviewProps) {
  if (!isVisible) return null;

  return (
    <div className={`absolute left-0 top-12 max-w-[220px] rounded-xl border px-3 py-2 text-sm shadow-lg ${darkMode ? "border-slate-700 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-700"}`}>
      <p className="font-medium">Replying to</p>
      <p className="truncate">{message}</p>
    </div>
  );
}
