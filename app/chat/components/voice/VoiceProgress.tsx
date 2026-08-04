"use client";

import { memo } from "react";
import VoiceDuration from "./VoiceDuration";

type VoiceProgressProps = {
  progress: number;
  currentTime: number;
  duration: number;
  isYou: boolean;
  isLoading: boolean;
  onSeek: (value: number) => void;
};

function VoiceProgress({ progress, currentTime, duration, isYou, isLoading, onSeek }: VoiceProgressProps) {
  return (
    <div className="min-w-0 flex-1">
      <div className={`relative h-2 overflow-hidden rounded-full ${isYou ? "bg-white/15 ring-1 ring-white/10" : "bg-black/10 ring-1 ring-black/5"}`}>
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-200 ease-out ${isYou ? "bg-white/90" : "bg-purple-600"}`}
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />

        <input
          type="range"
          min={0}
          max={duration || 0}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => onSeek(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="Seek voice message"
          aria-valuetext={isLoading ? "Loading audio" : `${currentTime.toFixed(1)} seconds`}
        />
      </div>

      <div className="mt-1 flex items-center justify-between">
        <VoiceDuration value={currentTime} isYou={isYou} label="current" />
        <VoiceDuration value={duration} isYou={isYou} label="total" />
      </div>
    </div>
  );
}

export default memo(VoiceProgress);
