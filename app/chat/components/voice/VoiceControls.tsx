"use client";

import { AlertCircle, Download, LoaderCircle, Pause, Play, RotateCcw } from "lucide-react";
import { memo } from "react";

type VoiceControlsProps = {
  isPlaying: boolean;
  isYou: boolean;
  playbackRateLabel: string;
  disabled: boolean;
  isLoading: boolean;
  isError: boolean;
  onToggle: () => void;
  onCycleRate: () => void;
  onReplay: () => void;
  onDownload: () => void;
};

function VoiceControls({
  isPlaying,
  isYou,
  playbackRateLabel,
  disabled,
  isLoading,
  isError,
  onToggle,
  onCycleRate,
  onReplay,
  onDownload,
}: VoiceControlsProps) {
  const playButtonClass = `flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200 active:scale-95 ${
    isYou
      ? "border-white/20 bg-[rgba(139,92,246,0.16)] text-white shadow-[0_25px_40px_rgba(139,92,246,0.22)] hover:bg-[rgba(139,92,246,0.22)]"
      : "border-[rgba(255,255,255,0.08)] bg-[#111827] text-[#22D3EE] shadow-[0_18px_35px_rgba(0,0,0,0.18)] hover:bg-[rgba(34,211,238,0.08)]"
  } ${disabled ? "cursor-not-allowed opacity-70" : ""}`;

  const iconButtonClass = `flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 active:scale-95 ${
    isYou ? "bg-[rgba(139,92,246,0.15)] text-white hover:bg-[rgba(139,92,246,0.22)]" : "bg-[rgba(255,255,255,0.05)] text-slate-100 hover:bg-[rgba(255,255,255,0.1)]"
  }`;

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onToggle} className={playButtonClass} aria-label={isPlaying ? "Pause voice message" : "Play voice message"} disabled={disabled}>
        {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : isError ? <AlertCircle className="h-4 w-4" /> : isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>

      <button type="button" onClick={onReplay} className={iconButtonClass} aria-label="Replay voice message">
        <RotateCcw className="h-3.5 w-3.5" />
      </button>

      <button type="button" onClick={onDownload} className={iconButtonClass} aria-label="Download voice message">
        <Download className="h-3.5 w-3.5" />
      </button>

      <button type="button" onClick={onCycleRate} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95 ${isYou ? "bg-[rgba(139,92,246,0.15)] text-white ring-1 ring-white/20" : "bg-[rgba(34,211,238,0.1)] text-[#22D3EE] ring-1 ring-[rgba(34,211,238,0.22)]"}`} aria-label={`Change playback speed to ${playbackRateLabel}`}>
        {playbackRateLabel}
      </button>
    </div>
  );
}

export default memo(VoiceControls);
