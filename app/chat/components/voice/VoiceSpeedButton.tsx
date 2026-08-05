"use client";

import { memo } from "react";

type VoiceSpeedButtonProps = {
  label: string;
  isYou: boolean;
  isActive: boolean;
  onClick: () => void;
};

function VoiceSpeedButton({ label, isYou, isActive, onClick }: VoiceSpeedButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 hover:scale-105 ${
        isYou
          ? `bg-[rgba(139,92,246,0.15)] text-white ${isActive ? "ring-1 ring-white/70" : ""}`
          : `bg-[rgba(34,211,238,0.1)] text-[#22D3EE] ${isActive ? "ring-1 ring-[rgba(34,211,238,0.3)]" : ""}`
      }`}
      aria-label={`Change playback speed to ${label}`}
    >
      {label}
    </button>
  );
}

export default memo(VoiceSpeedButton);
