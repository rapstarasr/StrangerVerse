import type { RefObject } from "react";

type LocalVideoProps = {
  localStream: MediaStream | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isAudioOnly: boolean;
  isScreenSharing: boolean;
  darkMode: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
};

export function LocalVideo({ localStream, isMuted, isCameraOff, isAudioOnly, isScreenSharing, darkMode, videoRef }: LocalVideoProps) {
  const containerClass = darkMode ? "border-slate-700 bg-slate-900/90" : "border-slate-200 bg-slate-50";

  return (
    <div className={`absolute bottom-4 right-4 w-32 overflow-hidden rounded-2xl border shadow-xl md:w-40 ${containerClass}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`aspect-video w-full object-cover ${isCameraOff ? "hidden" : "block"}`}
      />
      {!localStream || isCameraOff ? (
        <div className={`flex aspect-video items-center justify-center px-3 text-center text-xs ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          {isCameraOff ? "Camera off" : isAudioOnly ? "Audio only" : isScreenSharing ? "Screen shared" : "Camera preview"}
        </div>
      ) : null}
      <div className={`flex items-center justify-between px-2 py-2 text-[10px] ${darkMode ? "bg-slate-950/80 text-slate-200" : "bg-white/80 text-slate-700"}`}>
        <span>You</span>
        <span>{isMuted ? "Muted" : isScreenSharing ? "Sharing" : "Live"}</span>
      </div>
    </div>
  );
}
