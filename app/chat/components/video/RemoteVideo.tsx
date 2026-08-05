import type { RefObject } from "react";

type RemoteVideoProps = {
  remoteStream: MediaStream | null;
  isAudioOnly: boolean;
  darkMode: boolean;
  title: string;
  videoRef?: RefObject<HTMLVideoElement | null>;
};

export function RemoteVideo({ remoteStream, isAudioOnly, darkMode, title, videoRef }: RemoteVideoProps) {
  const overlayClass = "bg-[#070B17]/85 text-slate-100";

  return (
    <div className="flex h-full min-h-[300px] items-center justify-center overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[#090B17]">
      {remoteStream ? (
        <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
      ) : (
        <div className={`rounded-2xl border px-6 py-5 text-center ${overlayClass}`}>
          <p className="text-lg font-semibold">{title}</p>
          <p className="mt-2 text-sm opacity-80">{isAudioOnly ? "Voice call ready" : "Video call ready"}</p>
        </div>
      )}
    </div>
  );
}
