type ReactionPickerProps = {
  isVisible: boolean;
  onSelect: (emoji: string) => void;
  darkMode: boolean;
};

const emojis = ["👍", "❤️", "😂", "🎉", "🔥"];

export function ReactionPicker({ isVisible, onSelect, darkMode }: ReactionPickerProps) {
  if (!isVisible) return null;

  return (
    <div className={`absolute right-0 top-12 flex gap-2 rounded-full border px-3 py-2 shadow-lg ${darkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
      {emojis.map((emoji) => (
        <button key={emoji} className="text-lg" onClick={() => onSelect(emoji)} aria-label={`React with ${emoji}`}>
          {emoji}
        </button>
      ))}
    </div>
  );
}
