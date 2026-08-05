type StarButtonProps = {
  onStar: () => void;
  darkMode: boolean;
};

export function StarButton({ onStar, darkMode }: StarButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${darkMode ? "bg-[rgba(139,92,246,0.16)] text-white hover:bg-[rgba(139,92,246,0.22)]" : "bg-[rgba(255,255,255,0.06)] text-slate-200 hover:bg-[rgba(255,255,255,0.1)]"}`}
      onClick={onStar}
    >
      Star
    </button>
  );
}
