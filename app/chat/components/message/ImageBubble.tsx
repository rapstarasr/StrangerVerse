"use client";

import { memo } from "react";

type ImageBubbleProps = {
  src: string;
  alt: string;
  isYou: boolean;
};

function ImageBubble({ src, alt, isYou }: ImageBubbleProps) {
  return (
    <div className={`overflow-hidden rounded-[20px] border ${isYou ? "border-white/20" : "border-[rgba(255,255,255,0.10)]"}`}>
      <img src={src} alt={alt} className="max-h-72 w-full object-cover" />
    </div>
  );
}

export default memo(ImageBubble);
