type CopyButtonProps = {
  onCopy: () => void;
  darkMode: boolean;
};

export function CopyButton({ onCopy, darkMode }: CopyButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${darkMode ? "bg-[rgba(139,92,246,0.16)] text-white hover:bg-[rgba(139,92,246,0.24)]" : "bg-[#111827] text-slate-200 hover:bg-[#151e36]"}`}
      onClick={onCopy}
    >
      Copy
    </button>
  );
}
