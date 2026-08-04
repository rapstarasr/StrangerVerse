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
      ? "border-white/20 bg-white/15 text-white shadow-sm shadow-black/10 hover:bg-white/25"
      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-purple-200 hover:bg-purple-50"
  } ${disabled ? "cursor-not-allowed opacity-70" : ""}`;

  const iconButtonClass = `flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 active:scale-95 ${
    isYou ? "bg-white/15 text-white hover:bg-white/25" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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

      <button type="button" onClick={onCycleRate} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95 ${isYou ? "bg-white/15 text-white ring-1 ring-white/20" : "bg-slate-100 text-slate-700 ring-1 ring-slate-200"}`} aria-label={`Change playback speed to ${playbackRateLabel}`}>
        {playbackRateLabel}
      </button>
    </div>
  );
}

export default memo(VoiceControls);
