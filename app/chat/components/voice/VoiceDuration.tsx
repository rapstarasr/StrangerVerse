"use client";

import { memo } from "react";

type VoiceDurationProps = {
  value: number;
  isYou: boolean;
  label: "current" | "total";
};

const formatVoiceTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
};

function VoiceDuration({ value, isYou, label }: VoiceDurationProps) {
  return (
    <span className={`text-[11px] font-medium ${isYou ? "text-white/85" : "text-slate-600"}`}>
      {label === "current" ? formatVoiceTime(value) : formatVoiceTime(value)}
    </span>
  );
}

export default memo(VoiceDuration);
