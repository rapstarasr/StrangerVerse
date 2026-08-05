"use client";

import { type KeyboardEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import VoiceControls from "./voice/VoiceControls";
import VoiceWaveform from "./voice/VoiceWaveform";

type VoiceMessageBubbleProps = {
  src: string;
  sender: "you" | "stranger";
  status?: "loading" | "ready" | "error";
  className?: string;
};

type ActiveVoiceWindow = Window & {
  __strangerVerseActiveVoice?: HTMLAudioElement | null;
};

const speedOptions = [1, 1.5, 2] as const;
const playbackRateLabels = ["1x", "1.5x", "2x"] as const;

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

function VoiceMessageBubble({ src, sender, status = "ready", className = "" }: VoiceMessageBubbleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRateIndex, setPlaybackRateIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  const isYou = sender === "you";
  const playbackRate = speedOptions[playbackRateIndex];
  const playbackRateLabel = playbackRateLabels[playbackRateIndex];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLoading = status === "loading";
  const visibleError = error ?? (status === "error" ? "Unable to play this voice message." : null);

  const pauseOtherPlayers = useCallback((exceptAudio?: HTMLAudioElement | null) => {
    if (typeof window === "undefined") {
      return;
    }

    const activeWindow = window as ActiveVoiceWindow;
    const activePlayer = activeWindow.__strangerVerseActiveVoice;

    if (activePlayer && activePlayer !== exceptAudio) {
      activePlayer.pause();
    }

    if (exceptAudio) {
      activeWindow.__strangerVerseActiveVoice = exceptAudio;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setError(null);
      setIsBuffering(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      setIsBuffering(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setIsBuffering(false);
      if (typeof window !== "undefined") {
        const activeWindow = window as ActiveVoiceWindow;
        if (activeWindow.__strangerVerseActiveVoice === audio) {
          activeWindow.__strangerVerseActiveVoice = null;
        }
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      pauseOtherPlayers(audio);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsBuffering(false);
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);
    const handleError = () => {
      setError("Unable to play this voice message.");
      setIsPlaying(false);
      setIsBuffering(false);
    };

    audio.playbackRate = playbackRate;
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);

      if (typeof window !== "undefined") {
        const activeWindow = window as ActiveVoiceWindow;
        if (activeWindow.__strangerVerseActiveVoice === audio) {
          activeWindow.__strangerVerseActiveVoice = null;
        }
      }
    };
  }, [pauseOtherPlayers, playbackRate]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      if (typeof window !== "undefined") {
        const activeWindow = window as ActiveVoiceWindow;
        activeWindow.__strangerVerseActiveVoice = null;
      }
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio || !src) {
      return;
    }

    if (audio.paused) {
      try {
        setError(null);
        setIsBuffering(true);
        pauseOtherPlayers(audio);
        await audio.play();
      } catch {
        setError("Playback was blocked. Try again.");
        setIsBuffering(false);
      }
      return;
    }

    audio.pause();
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const nextTime = Math.max(0, Math.min(value, audio.duration || value));
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleReplay = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    setCurrentTime(0);

    if (audio.paused) {
      void togglePlayback();
      return;
    }

    void audio.play().catch(() => {
      setError("Playback was blocked. Try again.");
    });
  };

  const handleDownload = () => {
    if (!src) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = src;
    anchor.download = "voice-message";
    anchor.click();
  };

  const cyclePlaybackRate = () => {
    setPlaybackRateIndex((previous) => (previous + 1) % speedOptions.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " " || event.code === "Space") {
      event.preventDefault();
      void togglePlayback();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleSeek(Math.max(currentTime - 5, 0));
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleSeek(currentTime + 5);
    }
  };

  const bubbleClassName = useMemo(
    () =>
      `group relative w-[min(100%,360px)] rounded-[24px] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.22)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_30px_90px_rgba(0,0,0,0.28)] focus-visible:ring-2 focus-visible:ring-offset-2 sm:max-w-[380px] ${
        isYou
          ? "bg-gradient-to-br from-[#8B5CF6] to-[#22D3EE] text-white focus-visible:ring-white/80"
          : "bg-[#111827] text-slate-100 focus-visible:ring-[#8B5CF6]"
      } ${className}`,
    [className, isYou]
  );

  return (
    <div tabIndex={0} role="region" aria-label="Voice message player" onKeyDown={handleKeyDown} className={bubbleClassName}>
      <audio ref={audioRef} src={src || undefined} preload="metadata" />

      <div className="flex items-start gap-3">
        <VoiceControls
          isPlaying={isPlaying}
          isYou={isYou}
          playbackRateLabel={playbackRateLabel}
          disabled={!src || status === "error"}
          isLoading={isLoading || isBuffering}
          isError={Boolean(visibleError)}
          onToggle={() => {
            void togglePlayback();
          }}
          onCycleRate={cyclePlaybackRate}
          onReplay={handleReplay}
          onDownload={handleDownload}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.2em] opacity-80">
            <span>{isLoading ? "Loading" : isBuffering ? "Buffering" : isPlaying ? "Playing" : "Voice message"}</span>
            {isYou ? <span className="text-[12px] tracking-[0.2em]">✓✓</span> : null}
          </div>

          <div className="mb-2 h-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <div className="h-full rounded-full bg-current transition-all duration-200" style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
          </div>

          <VoiceWaveform isPlaying={isPlaying} isYou={isYou} progress={progress} />

          <div className="mt-2 flex items-center justify-between text-[11px] font-medium opacity-80">
            <span>{formatVoiceTime(currentTime)}</span>
            <span>{formatVoiceTime(duration)}</span>
          </div>
        </div>
      </div>

      {visibleError ? <p className={`mt-2 text-xs font-medium ${isYou ? "text-white/85" : "text-[#F87171]"}`}>{visibleError}</p> : null}
    </div>
  );
}

export default memo(VoiceMessageBubble);
