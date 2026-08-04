"use client";

import { memo } from "react";

type TextBubbleProps = {
  text: string;
  isYou: boolean;
};

const linkPattern = /(https?:\/\/[^\s]+)/g;

function TextBubble({ text, isYou }: TextBubbleProps) {
  const parts = text.split(linkPattern);

  return (
    <p className={`whitespace-pre-wrap break-words text-[15px] leading-6 ${isYou ? "text-white" : "text-slate-900"}`}>
      {parts.map((part, index) => {
        if (!part) {
          return null;
        }

        if (part.match(/^https?:\/\//)) {
          return (
            <a
              key={`${part}-${index}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={`break-all underline decoration-2 underline-offset-2 ${isYou ? "text-white/90" : "text-purple-700"}`}
            >
              {part}
            </a>
          );
        }

        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </p>
  );
}

export default memo(TextBubble);
