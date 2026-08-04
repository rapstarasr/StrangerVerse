"use client";

import { memo, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useMediaDevices } from "../hooks/useMediaDevices";
import { useWebRTC, type SignalingSocket } from "../hooks/useWebRTC";
import { getConnectionLabel, getNetworkLabel } from "../utils/webrtc";
import { CallControls } from "./video/CallControls";
import { CallHeader } from "./video/CallHeader";
import { CallTimer } from "./video/CallTimer";
import { LocalVideo } from "./video/LocalVideo";
import { NetworkIndicator } from "./video/NetworkIndicator";
import { PermissionDialog } from "./video/PermissionDialog";
import { RemoteVideo } from "./video/RemoteVideo";

type VideoCallProps = {
  title?: string;
  initialMode?: "video" | "audio";
  direction: "incoming" | "outgoing";
  accepted: boolean;
  socket: SignalingSocket | null;
  darkMode?: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onEnd?: () => void;
};

function VideoCall({
  title = "StrangerVerse Call",
  initialMode = "video",
  direction,
  accepted,
  socket,
  darkMode = true,
  onAccept,
  onDecline,
  onEnd,
}: VideoCallProps) {
  const { devices, permissionError, requestPermissions, hasPermission } = useMediaDevices();
  const rtc = useWebRTC({ initialMode, socket });
  const outgoingStartedRef = useRef(false);
  const incomingAnsweredRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void requestPermissions();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [requestPermissions]);

  useEffect(() => {
    if (direction === "outgoing" && accepted && !outgoingStartedRef.current) {
      outgoingStartedRef.current = true;
      void rtc.startOutgoingCall();
    }

    if (direction === "incoming" && accepted && rtc.callState === "incoming" && !incomingAnsweredRef.current) {
      incomingAnsweredRef.current = true;
      void rtc.answerIncomingCall();
    }
  }, [accepted, direction, rtc.answerIncomingCall, rtc.callState, rtc.startOutgoingCall]);

  const panelClasses = useMemo(
    () => (darkMode ? "border-slate-700 bg-slate-950 text-slate-50" : "border-slate-200 bg-white text-slate-900"),
    [darkMode]
  );

  const handleEnd = () => {
    rtc.endCall();
    onEnd?.();
  };

  const renderOverlay = (): ReactNode => {
    if (rtc.error) {
      return (
        <div className="absolute inset-x-4 top-4 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-200">
          {rtc.error}
        </div>
      );
    }

    if (direction === "incoming" && !accepted) {
      return (
        <div className="absolute inset-x-4 top-4 rounded-2xl border border-sky-500/40 bg-sky-500/10 p-3 text-sm text-sky-100">
          Incoming call · {title}
        </div>
      );
    }

    if (direction === "outgoing" && !accepted) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 p-6 text-center backdrop-blur-sm">
          <div className="rounded-[24px] border border-slate-700 bg-slate-900/90 px-6 py-8 shadow-2xl">
            <div className="mx-auto mb-3 flex h-12 w-12 animate-spin items-center justify-center rounded-full border-2 border-sky-500 border-t-transparent" />
            <p className="text-lg font-semibold">Calling {title}</p>
            <p className="mt-2 text-sm text-slate-400">Waiting for the stranger to accept.</p>
          </div>
        </div>
      );
    }

    if (rtc.callState === "ended") {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-6 text-center">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/90 px-6 py-8 shadow-2xl">
            <p className="text-lg font-semibold">Call ended</p>
            <p className="mt-2 text-sm text-slate-400">The conversation is wrapped up.</p>
            <button className="mt-5 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white" onClick={onEnd}>Close</button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className={`flex min-h-[560px] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border shadow-2xl ${panelClasses}`}>
      <CallHeader
        title={title}
        status={getConnectionLabel(rtc.callState, rtc.isMuted, rtc.isCameraOff, rtc.networkQuality)}
        darkMode={darkMode}
        connectionState={rtc.connectionState}
      />

      <div className="relative flex-1 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-3 md:p-4">
        <RemoteVideo remoteStream={rtc.remoteStream} isAudioOnly={rtc.isAudioOnly} darkMode={darkMode} title={title} videoRef={rtc.remoteVideoRef} />

        <LocalVideo
          localStream={rtc.localStream}
          isMuted={rtc.isMuted}
          isCameraOff={rtc.isCameraOff}
          isAudioOnly={rtc.isAudioOnly}
          isScreenSharing={rtc.isScreenSharing}
          darkMode={darkMode}
          videoRef={rtc.localVideoRef}
        />

        {renderOverlay()}
      </div>

      <div className="border-t border-slate-800/80 bg-slate-900/90 px-4 py-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <CallTimer startedAt={rtc.startedAt} darkMode={darkMode} />
          <NetworkIndicator quality={rtc.networkQuality} darkMode={darkMode} label={getNetworkLabel(rtc.networkQuality)} />
        </div>

        <CallControls
          isMuted={rtc.isMuted}
          isCameraOff={rtc.isCameraOff}
          isSpeakerOff={rtc.isSpeakerOff}
          isAudioOnly={rtc.isAudioOnly}
          isFullscreen={rtc.isFullscreen}
          isPiPEnabled={rtc.isPiPEnabled}
          isScreenSharing={rtc.isScreenSharing}
          devices={devices}
          hasPermission={hasPermission}
          hasRemoteStream={Boolean(rtc.remoteStream)}
          canReconnect={accepted && !(direction === "incoming" && !accepted)}
          onToggleMic={rtc.toggleMic}
          onToggleCamera={rtc.toggleCamera}
          onSwitchCamera={rtc.switchCamera}
          onToggleSpeaker={rtc.toggleSpeaker}
          onToggleFullscreen={rtc.toggleFullscreen}
          onTogglePiP={rtc.togglePiP}
          onToggleScreenShare={rtc.toggleScreenShare}
          showIncomingActions={direction === "incoming" && !accepted}
          onAccept={onAccept}
          onDecline={onDecline}
          onReconnect={() => {
            void rtc.reconnect();
          }}
          onEnd={handleEnd}
          onRequestPermissions={() => void requestPermissions()}
          darkMode={darkMode}
        />
      </div>

      {permissionError ? <PermissionDialog error={permissionError} onRetry={() => void requestPermissions()} darkMode={darkMode} /> : null}
    </section>
  );
}

export default memo(VideoCall);
