"use client";

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
};

const emojis = [
  "😀","😁","😂","🤣","😊","😍","😘","😎","🤔","😢",
  "😭","😡","👍","👎","👏","🙏","🔥","❤️","💔","🎉",
  "🥳","🤝","💯","✨","🚀","🌹","😴","🤯","😇","😜",
  "😅","🤩","🙌","👌","💖","🎂","🍕","☕","⚽","🎵"
];

export default function EmojiPicker({
  onSelect,
}: EmojiPickerProps) {
  return (
    <div className="absolute bottom-20 left-4 w-72 rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[#0B1222] shadow-[0_35px_90px_rgba(0,0,0,0.35)] p-4 z-50 backdrop-blur-xl">
      <div className="grid grid-cols-8 gap-3">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelect(emoji)}
            className="text-2xl rounded-2xl p-2 transition hover:bg-[rgba(139,92,246,0.16)]"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}