"use client";

import { memo } from "react";

type VoiceWaveformProps = {
  isPlaying: boolean;
  isYou: boolean;
  progress: number;
  bars?: number[];
};

const defaultBars = [8, 12, 16, 10, 14, 20, 12, 18, 14, 22, 9, 15, 24, 13, 18, 26, 11, 16, 20, 12];

function VoiceWaveform({ isPlaying, isYou, progress, bars = defaultBars }: VoiceWaveformProps) {
  const activeCount = Math.max(1, Math.round((progress / 100) * bars.length));

  return (
    <div className="flex h-12 items-end gap-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.04)] px-2 py-2">
      {bars.map((height, index) => {
        const isActive = index < activeCount;
        const barHeight = isActive ? Math.max(10, height + (isPlaying ? 6 : 0)) : Math.max(8, height * 0.7);

        return (
          <span
            key={`${height}-${index}`}
            className={`block w-1.5 rounded-full transition-all duration-200 ${isActive ? (isYou ? "bg-white" : "bg-[#22D3EE]") : isYou ? "bg-white/40" : "bg-[rgba(255,255,255,0.14)]"}`}
            style={{
              height: `${barHeight}px`,
              opacity: isPlaying ? 1 : 0.7,
              transform: isPlaying ? "scaleY(1.02)" : "scaleY(0.96)",
              animation: isPlaying ? `voice-wave 900ms ease-in-out infinite ${index * 0.05}s` : "none",
              transformOrigin: "bottom center",
            }}
          />
        );
      })}
    </div>
  );
}

export default memo(VoiceWaveform);
