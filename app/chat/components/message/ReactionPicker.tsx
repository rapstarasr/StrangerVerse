type ReactionPickerProps = {
  isVisible: boolean;
  onSelect: (emoji: string) => void;
  darkMode: boolean;
};

const emojis = ["👍", "❤️", "😂", "🎉", "🔥"];

export function ReactionPicker({ isVisible, onSelect, darkMode }: ReactionPickerProps) {
  if (!isVisible) return null;

  return (
    <div className={`absolute right-0 top-12 flex gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[#0E172A] px-3 py-2 shadow-[0_24px_60px_rgba(0,0,0,0.28)]`}>
      {emojis.map((emoji) => (
        <button key={emoji} className="text-lg" onClick={() => onSelect(emoji)} aria-label={`React with ${emoji}`}>
          {emoji}
        </button>
      ))}
    </div>
  );
}
