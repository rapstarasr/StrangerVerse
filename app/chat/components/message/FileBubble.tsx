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
    <div className={`max-w-[min(100%,320px)] rounded-[20px] border px-3 py-3 ${isYou ? "border-white/20 bg-white/10" : "border-slate-200 bg-slate-50"}`}>
      <div className={`mb-2 text-sm font-semibold ${isYou ? "text-white" : "text-slate-800"}`}>
        {fileName}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium transition hover:opacity-90 ${isYou ? "bg-white text-purple-700" : "bg-purple-600 text-white"}`}
      >
        {label}
      </a>
    </div>
  );
}

export default memo(FileBubble);
