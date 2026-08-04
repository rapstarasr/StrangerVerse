"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Socket } from "socket.io-client";

/** Minimal Socket.IO-compatible surface. Pass the socket returned by your useSocket hook. */
export type SignalingSocket = Pick<Socket, "connected" | "emit" | "on" | "off">;

export type CallState =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "incoming"
  | "outgoing"
  | "active"
  | "ended";

type SignalEnvelope<T> = T & { roomId?: string; targetId?: string; from?: string; to?: string; type?: string; candidateType?: string };

export type UseWebRTCProps = {
  initialMode?: "video" | "audio";
  /** Socket.IO socket. Without this, media preview works but a remote peer cannot connect. */
  socket?: SignalingSocket | null;
  /** Include this when your server routes calls by room. */
  roomId?: string;
  /** Include this when your server routes calls to a socket/user id. */
  targetId?: string;
  /** Override only if your signaling server uses different event names. */
  events?: Partial<WebRTCSignalEvents>;
  iceServers?: RTCIceServer[];
  /** Called whenever a signalling message should be sent; useful with a non-Socket.IO backend. */
  sendSignal?: (event: string, payload: Record<string, unknown>) => void;
};

export type WebRTCSignalEvents = {
  offer: string;
  answer: string;
  iceCandidate: string;
  hangup: string;
};

export type UseWebRTCResult = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callState: CallState;
  connectionState: string;
  networkQuality: number;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeakerOff: boolean;
  isAudioOnly: boolean;
  isFullscreen: boolean;
  isPiPEnabled: boolean;
  isScreenSharing: boolean;
  error: string | null;
  startedAt: number | null;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
  startOutgoingCall: () => Promise<void>;
  answerIncomingCall: () => Promise<void>;
  endCall: () => void;
  toggleMic: () => void;
  toggleCamera: () => void;
  switchCamera: () => Promise<void>;
  toggleSpeaker: () => void;
  toggleFullscreen: () => void;
  togglePiP: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  reconnect: () => Promise<void>;
};

const DEFAULT_EVENTS: WebRTCSignalEvents = {
  offer: "webrtc-offer",
  answer: "webrtc-answer",
  iceCandidate: "webrtc-ice",
  hangup: "webrtc-hangup",
};

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
];

function messageOf(error: unknown, fallback: string) {
  if (error instanceof DOMException && error.name === "NotAllowedError") return "Camera or microphone permission was denied.";
  if (error instanceof DOMException && error.name === "NotFoundError") return "No suitable camera or microphone was found.";
  return error instanceof Error ? error.message : fallback;
}

export function useWebRTC({
  initialMode = "video",
  socket = null,
  roomId,
  targetId,
  events: eventOverrides,
  iceServers = DEFAULT_ICE_SERVERS,
  sendSignal,
}: UseWebRTCProps = {}): UseWebRTCResult {
  const events = useMemo(() => ({ ...DEFAULT_EVENTS, ...eventOverrides }), [eventOverrides]);
  const isAudioOnly = initialMode === "audio";
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<CallState>("idle");
  const [connectionState, setConnectionState] = useState("new");
  const [networkQuality, setNetworkQuality] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiPEnabled, setIsPiPEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const cameraTrackRef = useRef<MediaStreamTrack | null>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const pendingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);
  const isUnmountedRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const cameraDeviceIdRef = useRef<string | undefined>(undefined);

  const emitSignal = useCallback((event: string, data: Record<string, unknown>) => {
    const payload = { ...data, ...(roomId ? { roomId } : {}), ...(targetId ? { targetId } : {}) };
    if (sendSignal) sendSignal(event, payload);
    else socket?.emit(event, payload);
  }, [roomId, sendSignal, socket, targetId]);

  const attachLocalStream = useCallback((stream: MediaStream) => {
    localStreamRef.current = stream;
    cameraTrackRef.current = stream.getVideoTracks()[0] ?? null;
    if (!isUnmountedRef.current) setLocalStream(stream);
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  }, []);

  const getLocalStream = useCallback(async () => {
    if (localStreamRef.current?.getTracks().some((track) => track.readyState === "live")) return localStreamRef.current;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser does not support camera and microphone access.");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: isAudioOnly ? false : { deviceId: cameraDeviceIdRef.current ? { exact: cameraDeviceIdRef.current } : undefined, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
    attachLocalStream(stream);
    return stream;
  }, [attachLocalStream, isAudioOnly]);

  const flushCandidates = useCallback(async (pc: RTCPeerConnection) => {
    const candidates = pendingCandidatesRef.current.splice(0);
    for (const candidate of candidates) await pc.addIceCandidate(candidate);
  }, []);

  const updateNetworkQuality = useCallback(async (pc: RTCPeerConnection) => {
    const stats = await pc.getStats();
    let rtt = 0;
    stats.forEach((report) => { if (report.type === "candidate-pair" && report.state === "succeeded") rtt = Number(report.currentRoundTripTime ?? 0) * 1000; });
    if (!isUnmountedRef.current) setNetworkQuality(rtt === 0 ? 4 : rtt < 100 ? 5 : rtt < 250 ? 4 : rtt < 500 ? 3 : 2);
  }, []);

  const createPeerConnection = useCallback(async () => {
    if (pcRef.current && pcRef.current.connectionState !== "closed") return pcRef.current;
    const pc = new RTCPeerConnection({ iceServers, iceCandidatePoolSize: 10, bundlePolicy: "max-bundle" });
    pcRef.current = pc;
    const stream = await getLocalStream();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    pc.onicecandidate = ({ candidate }) => { if (candidate) emitSignal(events.iceCandidate, { candidate: candidate.toJSON() }); };
    pc.ontrack = ({ track, streams }) => {
      const next = remoteStreamRef.current ?? new MediaStream();
      const source = streams[0];
      if (source) source.getTracks().forEach((item) => { if (!next.getTracks().some((old) => old.id === item.id)) next.addTrack(item); });
      else if (!next.getTracks().some((item) => item.id === track.id)) next.addTrack(track);
      remoteStreamRef.current = next;
      if (!isUnmountedRef.current) setRemoteStream(next);
    };
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (pc !== pcRef.current || isUnmountedRef.current) return;
      setConnectionState(state);
      if (state === "connected") { setCallState("active"); void updateNetworkQuality(pc); }
      if (state === "failed") setCallState("reconnecting");
      if (state === "closed") setCallState("ended");
    };
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "disconnected" && pc === pcRef.current) setCallState("reconnecting");
    };
    return pc;
  }, [emitSignal, events.iceCandidate, getLocalStream, iceServers, updateNetworkQuality]);

  const closePeerConnection = useCallback(() => {
    const pc = pcRef.current;
    pcRef.current = null;
    if (pc) { pc.onicecandidate = null; pc.ontrack = null; pc.close(); }
    remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
    remoteStreamRef.current = null;
    pendingCandidatesRef.current = [];
    if (!isUnmountedRef.current) setRemoteStream(null);
  }, []);

  const stopAllMedia = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    cameraTrackRef.current = null;
    screenTrackRef.current = null;
    if (!isUnmountedRef.current) setLocalStream(null);
  }, []);

  const stopScreenShare = useCallback(async () => {
    const screen = screenTrackRef.current;
    if (!screen) return;
    const pc = pcRef.current;
    const camera = cameraTrackRef.current;
    const sender = pc?.getSenders().find((item) => item.track?.kind === "video");
    if (sender) await sender.replaceTrack(camera ?? null);
    const stream = localStreamRef.current;
    if (stream) { stream.removeTrack(screen); if (camera && !stream.getVideoTracks().includes(camera)) stream.addTrack(camera); }
    screen.stop();
    screenTrackRef.current = null;
    if (!isUnmountedRef.current) { setIsScreenSharing(false); setLocalStream(stream ? new MediaStream(stream.getTracks()) : null); }
  }, []);

  const handleOffer = useCallback(async (payload: SignalEnvelope<{ offer?: RTCSessionDescriptionInit }>) => {
    const offer = payload.offer ?? (payload.type === "offer" ? payload as RTCSessionDescriptionInit : null);
    if (!offer) return;
    try {
      setError(null); setCallState("incoming");
      pendingOfferRef.current = offer;
    } catch (caught) { setError(messageOf(caught, "Unable to receive call.")); }
  }, []);

  const answerIncomingCall = useCallback(async () => {
    const offer = pendingOfferRef.current;
    if (!offer) { setError("There is no incoming call to answer."); return; }
    try {
      setError(null); setCallState("connecting"); setStartedAt(Date.now());
      const pc = await createPeerConnection();
      await pc.setRemoteDescription(offer);
      await flushCandidates(pc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      emitSignal(events.answer, { answer: pc.localDescription?.toJSON() });
      pendingOfferRef.current = null;
    } catch (caught) { setError(messageOf(caught, "Unable to answer call.")); setCallState("ended"); }
  }, [createPeerConnection, emitSignal, events.answer, flushCandidates]);

  const startOutgoingCall = useCallback(async () => {
    try {
      setError(null); setCallState("outgoing"); setConnectionState("connecting"); setStartedAt(Date.now());
      const pc = await createPeerConnection();
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: !isAudioOnly });
      await pc.setLocalDescription(offer);
      emitSignal(events.offer, { offer: pc.localDescription?.toJSON() });
    } catch (caught) { setError(messageOf(caught, "Unable to start call.")); setCallState("ended"); }
  }, [createPeerConnection, emitSignal, events.offer, isAudioOnly]);

  const handleAnswer = useCallback(async (payload: SignalEnvelope<{ answer?: RTCSessionDescriptionInit }>) => {
    const answer = payload.answer ?? (payload.type === "answer" ? payload as RTCSessionDescriptionInit : null);
    const pc = pcRef.current;
    if (!answer || !pc || pc.signalingState === "closed") return;
    try { await pc.setRemoteDescription(answer); await flushCandidates(pc); } catch (caught) { setError(messageOf(caught, "Unable to establish call.")); }
  }, [flushCandidates]);

  const handleCandidate = useCallback(async (payload: SignalEnvelope<{ candidate?: RTCIceCandidateInit }>) => {
    const candidate = payload.candidate ?? (payload.candidateType ? payload as RTCIceCandidateInit : null);
    const pc = pcRef.current;
    if (!candidate) return;
    if (!pc || !pc.remoteDescription) { pendingCandidatesRef.current.push(candidate); return; }
    try { await pc.addIceCandidate(candidate); } catch (caught) { console.warn("Could not add remote ICE candidate", caught); }
  }, []);

  const endCall = useCallback(() => {
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    emitSignal(events.hangup, {});
    closePeerConnection(); stopAllMedia(); pendingOfferRef.current = null;
    setCallState("ended"); setConnectionState("closed"); setStartedAt(null); setNetworkQuality(0); setError(null); setIsScreenSharing(false);
  }, [closePeerConnection, emitSignal, events.hangup, stopAllMedia]);

  const toggleMic = useCallback(() => { const muted = !isMuted; localStreamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !muted; }); setIsMuted(muted); }, [isMuted]);
  const toggleCamera = useCallback(() => { if (isAudioOnly) return; const off = !isCameraOff; if (cameraTrackRef.current) cameraTrackRef.current.enabled = !off; setIsCameraOff(off); }, [isAudioOnly, isCameraOff]);

  const switchCamera = useCallback(async () => {
    if (isAudioOnly) return;
    try {
      const devices = (await navigator.mediaDevices.enumerateDevices()).filter((item) => item.kind === "videoinput");
      if (devices.length < 2) return;
      const currentId = cameraTrackRef.current?.getSettings().deviceId;
      const next = devices.find((item) => item.deviceId !== currentId) ?? devices[0];
      const fresh = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: next.deviceId } }, audio: false });
      const replacement = fresh.getVideoTracks()[0]; if (!replacement) return;
      replacement.enabled = !isCameraOff;
      await pcRef.current?.getSenders().find((sender) => sender.track?.kind === "video")?.replaceTrack(replacement);
      const previous = cameraTrackRef.current; const stream = localStreamRef.current;
      if (stream && previous) stream.removeTrack(previous);
      if (stream) stream.addTrack(replacement);
      previous?.stop(); cameraTrackRef.current = replacement; cameraDeviceIdRef.current = next.deviceId;
      if (stream) setLocalStream(new MediaStream(stream.getTracks()));
    } catch (caught) { setError(messageOf(caught, "Unable to switch camera.")); }
  }, [isAudioOnly, isCameraOff]);

  const toggleSpeaker = useCallback(() => {
    const next = !isSpeakerOff; const video = remoteVideoRef.current as (HTMLVideoElement & { setSinkId?: (id: string) => Promise<void> }) | null;
    if (video?.setSinkId) void video.setSinkId(next ? "" : "default").catch(() => undefined);
    setIsSpeakerOff(next);
  }, [isSpeakerOff]);

  const toggleFullscreen = useCallback(() => { const target = remoteVideoRef.current?.parentElement ?? localVideoRef.current?.parentElement; if (!target) return; if (document.fullscreenElement) void document.exitFullscreen(); else void target.requestFullscreen?.(); }, []);
  const togglePiP = useCallback(async () => { const video = remoteVideoRef.current ?? localVideoRef.current; if (!video || !document.pictureInPictureEnabled) return; try { if (document.pictureInPictureElement) await document.exitPictureInPicture(); else await video.requestPictureInPicture(); } catch (caught) { setError(messageOf(caught, "Picture-in-picture is unavailable.")); } }, []);

  const toggleScreenShare = useCallback(async () => {
    if (isAudioOnly) return;
    if (screenTrackRef.current) { await stopScreenShare(); return; }
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const screen = display.getVideoTracks()[0]; if (!screen) return;
      const sender = pcRef.current?.getSenders().find((item) => item.track?.kind === "video");
      await sender?.replaceTrack(screen);
      const stream = localStreamRef.current; if (stream && cameraTrackRef.current) stream.removeTrack(cameraTrackRef.current); if (stream) stream.addTrack(screen);
      screenTrackRef.current = screen; screen.onended = () => { void stopScreenShare(); };
      setIsScreenSharing(true); if (stream) setLocalStream(new MediaStream(stream.getTracks()));
    } catch (caught) { setError(messageOf(caught, "Unable to start screen sharing.")); }
  }, [isAudioOnly, stopScreenShare]);

  const reconnect = useCallback(async () => {
    try { setCallState("reconnecting"); closePeerConnection(); await startOutgoingCall(); } catch (caught) { setError(messageOf(caught, "Reconnect failed.")); setCallState("ended"); }
  }, [closePeerConnection, startOutgoingCall]);

  useEffect(() => {
    if (!socket) return;
    socket.on(events.offer, handleOffer); socket.on(events.answer, handleAnswer); socket.on(events.iceCandidate, handleCandidate);
    const remoteHangup = () => { closePeerConnection(); stopAllMedia(); setCallState("ended"); setConnectionState("closed"); setStartedAt(null); setIsScreenSharing(false); };
    socket.on(events.hangup, remoteHangup);
    return () => { socket.off?.(events.offer, handleOffer); socket.off?.(events.answer, handleAnswer); socket.off?.(events.iceCandidate, handleCandidate); socket.off?.(events.hangup, remoteHangup); };
  }, [closePeerConnection, events, handleAnswer, handleCandidate, handleOffer, socket, stopAllMedia]);

  useEffect(() => { const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement)); const onPiP = () => setIsPiPEnabled(Boolean(document.pictureInPictureElement)); document.addEventListener("fullscreenchange", onFullscreen); document.addEventListener("enterpictureinpicture", onPiP); document.addEventListener("leavepictureinpicture", onPiP); return () => { document.removeEventListener("fullscreenchange", onFullscreen); document.removeEventListener("enterpictureinpicture", onPiP); document.removeEventListener("leavepictureinpicture", onPiP); }; }, []);
  useEffect(() => { if (localVideoRef.current) localVideoRef.current.srcObject = localStream; }, [localStream]);
  useEffect(() => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream; }, [remoteStream]);
  useEffect(() => () => { isUnmountedRef.current = true; if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current); closePeerConnection(); stopAllMedia(); }, [closePeerConnection, stopAllMedia]);

  return useMemo(() => ({ localStream, remoteStream, callState, connectionState, networkQuality, isMuted, isCameraOff, isSpeakerOff, isAudioOnly, isFullscreen, isPiPEnabled, isScreenSharing, error, startedAt, localVideoRef, remoteVideoRef, startOutgoingCall, answerIncomingCall, endCall, toggleMic, toggleCamera, switchCamera, toggleSpeaker, toggleFullscreen, togglePiP, toggleScreenShare, reconnect }), [answerIncomingCall, callState, connectionState, endCall, error, isAudioOnly, isCameraOff, isFullscreen, isMuted, isPiPEnabled, isScreenSharing, isSpeakerOff, localStream, networkQuality, reconnect, remoteStream, startOutgoingCall, startedAt, switchCamera, toggleCamera, toggleFullscreen, toggleMic, togglePiP, toggleScreenShare, toggleSpeaker]);
}
