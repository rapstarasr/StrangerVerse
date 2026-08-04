"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildWaveformLevels, waveformBars } from "../utils/voice";

type RecordingState =
  | "idle"
  | "holding"
  | "recording"
  | "locked"
  | "paused"
  | "preview"
  | "sending"
  | "cancelled";

type UseVoiceRecorderOptions = {
  onVoiceRecorded?: (audio: Blob | null) => void;
  onFocusInput?: () => void;
  onRecordingComplete?: () => void;
};

export function useVoiceRecorder({
  onVoiceRecorded,
  onFocusInput,
  onRecordingComplete,
}: UseVoiceRecorderOptions) {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [voicePreviewUrl, setVoicePreviewUrl] = useState<string | null>(null);
  const [permissionPending, setPermissionPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragOffset, setDragOffset] = useState(0);
  const [recordingLevels, setRecordingLevels] = useState<number[]>(waveformBars);

  const holdTimerRef = useRef<number | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const dragStartYRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const analyserDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const shouldAutoSendRef = useRef(false);

  const isRecording = recordingState === "recording" || recordingState === "locked";
  const showPreview = Boolean(voicePreviewUrl) && (recordingState === "preview" || recordingState === "sending");

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopAudioAnalyser = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    analyserDataRef.current = null;
  };

  const releasePreviewUrl = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  const cleanupRecordingResources = useCallback(() => {
    shouldAutoSendRef.current = false;
    holdTimerRef.current = null;
    holdStartRef.current = null;
    stopTimer();
    stopAudioAnalyser();

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;

      if (mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // Ignore recorder stop races.
        }
      }

      mediaRecorderRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    releasePreviewUrl();
    chunksRef.current = [];
  }, [releasePreviewUrl]);

  const resetDragState = useCallback(() => {
    setDragOffset(0);
    dragStartXRef.current = null;
  }, []);

  const clearPreview = useCallback(
    (notifyParent = true) => {
      releasePreviewUrl();
      setVoicePreviewUrl(null);
      if (notifyParent) {
        onVoiceRecorded?.(null);
      }
    },
    [onVoiceRecorded, releasePreviewUrl]
  );

  const startAudioAnalyser = useCallback(() => {
    if (!streamRef.current) {
      return;
    }

    stopAudioAnalyser();

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.85;

    const source = audioContext.createMediaStreamSource(streamRef.current);
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    analyserDataRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

    const updateRecordingLevels = () => {
      if (!analyserRef.current || !analyserDataRef.current) {
        return;
      }

      analyserRef.current.getByteFrequencyData(analyserDataRef.current as Uint8Array<ArrayBuffer>);
      setRecordingLevels(buildWaveformLevels(analyserDataRef.current));
      animationFrameRef.current = window.requestAnimationFrame(updateRecordingLevels);
    };

    animationFrameRef.current = window.requestAnimationFrame(updateRecordingLevels);
  }, []);

  const startRecording = useCallback(async () => {
    if (permissionPending || isRecording || recordingState === "preview" || recordingState === "sending") {
      return;
    }

    setErrorMessage("");
    setPermissionPending(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      startAudioAnalyser();

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        releasePreviewUrl();

        const nextPreview = URL.createObjectURL(blob);
        previewUrlRef.current = nextPreview;
        setVoicePreviewUrl(nextPreview);
        onVoiceRecorded?.(blob);
        if (shouldAutoSendRef.current) {
          shouldAutoSendRef.current = false;
          setRecordingState("idle");
          setVoicePreviewUrl(null);
          window.setTimeout(() => {
            onRecordingComplete?.();
          }, 0);
        } else {
          setRecordingState("preview");
        }
        onFocusInput?.();
        stopAudioAnalyser();

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        mediaRecorderRef.current = null;
      };

      recorder.start();
      setRecordingState("recording");
      setRecordingTime(0);
      setPermissionPending(false);
      setRecordingLevels(waveformBars);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((time) => time + 1);
      }, 1000);
    } catch {
      setPermissionPending(false);
      setErrorMessage("Microphone access was denied. Please allow mic access and try again.");
      cleanupRecordingResources();
      setRecordingState("idle");
    }
  }, [cleanupRecordingResources, isRecording, onFocusInput, onRecordingComplete, onVoiceRecorded, permissionPending, recordingState, startAudioAnalyser]);

  const stopRecording = useCallback((autoSend = false) => {
    if (!isRecording) {
      return;
    }

    if (autoSend) {
      shouldAutoSendRef.current = true;
    }

    stopAudioAnalyser();
    mediaRecorderRef.current?.stop();
    stopTimer();
    setRecordingState("preview");
    resetDragState();
  }, [isRecording, resetDragState]);

  const beginHold = useCallback(() => {
    if (permissionPending || showPreview || recordingState === "holding" || recordingState === "paused") {
      return;
    }

    if (recordingState === "recording" || recordingState === "locked") {
      stopRecording();
      return;
    }

    holdStartRef.current = Date.now();
    setRecordingState("holding");

    holdTimerRef.current = window.setTimeout(() => {
      holdTimerRef.current = null;
      void startRecording();
    }, 180);
  }, [permissionPending, recordingState, showPreview, startRecording, stopRecording]);

  const endHold = useCallback(() => {
    const duration = holdStartRef.current ? Date.now() - holdStartRef.current : 0;

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    holdStartRef.current = null;

    if (duration < 180) {
      if (recordingState === "holding") {
        setRecordingState("idle");
      }
      return;
    }

    if (isRecording) {
      stopRecording(true);
    }
  }, [isRecording, recordingState, stopRecording]);

  const cancelRecording = useCallback(() => {
    cleanupRecordingResources();
    setRecordingState("idle");
    setRecordingTime(0);
    setRecordingLevels(waveformBars);
    clearPreview(true);
    resetDragState();
    setErrorMessage("");
    onFocusInput?.();
  }, [clearPreview, cleanupRecordingResources, onFocusInput, resetDragState]);

  const deleteVoice = useCallback(() => {
    cleanupRecordingResources();
    setRecordingState("idle");
    setRecordingTime(0);
    setRecordingLevels(waveformBars);
    clearPreview(true);
    resetDragState();
    setErrorMessage("");
    onFocusInput?.();
  }, [clearPreview, cleanupRecordingResources, onFocusInput, resetDragState]);

  const handleRecordingPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isRecording) {
      return;
    }

    dragStartXRef.current = event.clientX;
    dragStartYRef.current = event.clientY;
    setDragOffset(0);
  }, [isRecording]);

  const handleRecordingPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isRecording || dragStartXRef.current === null || dragStartYRef.current === null) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;
    const deltaY = event.clientY - dragStartYRef.current;

    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -90) {
      setRecordingState("locked");
      setDragOffset(0);
      dragStartXRef.current = null;
      dragStartYRef.current = null;
      return;
    }

    if (deltaX < 0) {
      setDragOffset(Math.max(deltaX, -160));
    }
  }, [isRecording]);

  const handleRecordingPointerUp = useCallback(() => {
    if (!isRecording) {
      resetDragState();
      return;
    }

    if (recordingState === "locked") {
      resetDragState();
      return;
    }

    if (dragOffset <= -120) {
      cancelRecording();
      return;
    }

    resetDragState();
  }, [cancelRecording, dragOffset, isRecording, recordingState, resetDragState]);

  const handleSendVoice = useCallback(() => {
    if (!voicePreviewUrl) {
      return;
    }

    cleanupRecordingResources();
    setRecordingState("idle");
    setRecordingTime(0);
    setRecordingLevels(waveformBars);
    setVoicePreviewUrl(null);
    resetDragState();
  }, [cleanupRecordingResources, resetDragState, voicePreviewUrl]);

  const pauseRecording = useCallback(() => {
    if (recordingState !== "recording" && recordingState !== "locked") {
      return;
    }

    if (mediaRecorderRef.current && typeof mediaRecorderRef.current.pause === "function" && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
    } else {
      stopAudioAnalyser();
      stopTimer();
    }

    setRecordingState("paused");
    resetDragState();
  }, [recordingState, resetDragState]);

  const resumeRecording = useCallback(() => {
    if (recordingState !== "paused") {
      return;
    }

    if (mediaRecorderRef.current && typeof mediaRecorderRef.current.resume === "function" && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
    }

    startAudioAnalyser();
    setRecordingState("recording");
    setRecordingTime((time) => time);
    setRecordingLevels(waveformBars);
    timerRef.current = window.setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 1000);
  }, [recordingState, startAudioAnalyser]);

  useEffect(() => {
    return () => {
      cleanupRecordingResources();
      clearPreview(false);
    };
  }, [cleanupRecordingResources, clearPreview]);

  return {
    recordingState,
    recordingTime,
    voicePreviewUrl,
    permissionPending,
    errorMessage,
    dragOffset,
    recordingLevels,
    isRecording,
    showPreview,
    startRecording,
    stopRecording,
    beginHold,
    endHold,
    cancelRecording,
    deleteVoice,
    pauseRecording,
    resumeRecording,
    handleRecordingPointerDown,
    handleRecordingPointerMove,
    handleRecordingPointerUp,
    handleSendVoice,
    setErrorMessage,
  };
}
