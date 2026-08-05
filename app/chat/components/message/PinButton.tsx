type PinButtonProps = {
  onPin: () => void;
  darkMode: boolean;
};

export function PinButton({ onPin, darkMode }: PinButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${darkMode ? "bg-[rgba(139,92,246,0.16)] text-[#8B5CF6] hover:bg-[rgba(139,92,246,0.24)]" : "bg-[rgba(255,255,255,0.06)] text-slate-200 hover:bg-[rgba(255,255,255,0.1)]"}`}
      onClick={onPin}
    >
      Pin
    </button>
  );
}
