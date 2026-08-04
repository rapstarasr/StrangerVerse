type CopyButtonProps = {
  onCopy: () => void;
  darkMode: boolean;
};

export function CopyButton({ onCopy, darkMode }: CopyButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${darkMode ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
      onClick={onCopy}
    >
      Copy
    </button>
  );
}
