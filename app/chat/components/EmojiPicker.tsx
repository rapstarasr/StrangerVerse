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
    <div className="absolute bottom-20 left-4 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-3 z-50">

      <div className="grid grid-cols-8 gap-2">

        {emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onSelect(emoji)}
            className="text-2xl hover:bg-gray-700 rounded-lg p-2 transition"
          >
            {emoji}
          </button>
        ))}

      </div>

    </div>
  );
}