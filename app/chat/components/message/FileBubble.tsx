"use client";

import { memo } from "react";

type FileBubbleProps = {
  fileName: string;
  url: string;
  type: string;
  isYou: boolean;
};

function FileBubble({ fileName, url, type, isYou }: FileBubbleProps) {
  const label = type === "pdf" ? "Open PDF" : type === "video" ? "Open video" : "Open file";

  return (
    <div className={`max-w-[min(100%,320px)] rounded-[20px] border px-3 py-3 ${isYou ? "border-white/20 bg-[rgba(255,255,255,0.1)]" : "border-[rgba(255,255,255,0.08)] bg-[#0F172A]"}`}>
      <div className={`mb-2 text-sm font-semibold ${isYou ? "text-white" : "text-slate-100"}`}>
        {fileName}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium transition hover:opacity-90 ${isYou ? "bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE] text-white" : "bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20"}`}
      >
        {label}
      </a>
    </div>
  );
}

export default memo(FileBubble);
