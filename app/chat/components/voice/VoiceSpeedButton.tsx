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
          ? `bg-white/15 text-white ${isActive ? "ring-1 ring-white/70" : ""}`
          : `bg-purple-50 text-purple-700 ${isActive ? "ring-1 ring-purple-300" : ""}`
      }`}
      aria-label={`Change playback speed to ${label}`}
    >
      {label}
    </button>
  );
}

export default memo(VoiceSpeedButton);
