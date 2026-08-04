"use client";

import { memo, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Smile, SendHorizontal, Mic, Trash2, X, FileText, Image, Paperclip, Lock, Pause, Play } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import FileAttachment from "./FileAttachment";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import type { ReplyMetadata } from "../types/chat";
import { getReplyPreviewText, getReplyPreviewUrl } from "../utils/message";

type MessageInputProps = {
  message: string;
  selectedFile: File | null;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileSelect: (file: File) => void;
  onClearFile: () => void;
  onVoiceRecorded?: (audio: Blob | null) => void;
  replyTo?: ReplyMetadata | null;
  onCancelReply?: () => void;
};

function MessageInput({
  message,
  selectedFile,
  onChange,
  onSend,
  onFileSelect,
  onClearFile,
  onVoiceRecorded,
  replyTo,
  onCancelReply,
}: MessageInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoSendVoiceRef = useRef<(() => void) | null>(null);

  const focusInput = () => requestAnimationFrame(() => inputRef.current?.focus());

  const handleSend = () => {
    setErrorMessage("");
    onSend();
    focusInput();
  };

  const handleSendVoice = () => {
    setErrorMessage("");
    submitVoicePreview();
    onSend();
    focusInput();
  };

  const {
    recordingState,
    recordingTime,
    voicePreviewUrl,
    permissionPending,
    errorMessage,
    dragOffset,
    recordingLevels,
    isRecording,
    showPreview,
    stopRecording,
    beginHold,
    endHold,
    deleteVoice,
    pauseRecording,
    resumeRecording,
    handleRecordingPointerDown,
    handleRecordingPointerMove,
    handleRecordingPointerUp,
    handleSendVoice: submitVoicePreview,
    setErrorMessage,
  } = useVoiceRecorder({
    onVoiceRecorded,
    onFocusInput: () => inputRef.current?.focus(),
    onRecordingComplete: () => autoSendVoiceRef.current?.(),
  });

  const handleAutoSendVoice = () => {
    setErrorMessage("");
    submitVoicePreview();
    requestAnimationFrame(() => {
      onSend();
      focusInput();
    });
  };

  useEffect(() => {
    autoSendVoiceRef.current = handleAutoSendVoice;
  }, [handleAutoSendVoice]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addEmoji = (emoji: string) => {
    onChange(message + emoji);
    setShowEmojiPicker(false);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleMicKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (isRecording) {
        stopRecording(true);
      } else {
        beginHold();
      }
    }
  };

  const handleMicKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      endHold();
    }
  };

  const handleHoldStart = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (isRecording) {
      stopRecording();
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    beginHold();
  };

  const handleHoldEnd = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    endHold();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const replyPreviewText = replyTo ? getReplyPreviewText(replyTo.text) : "";
  const replyPreviewUrl = replyTo ? getReplyPreviewUrl(replyTo.text) : "";
  const replyIcon = replyTo?.type === "voice" ? <Mic className="h-4 w-4" /> : replyTo?.type === "image" ? <Image className="h-4 w-4" /> : replyTo?.type === "pdf" || replyTo?.type === "file" || replyTo?.type === "video" ? <FileText className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />;
  const recordingHint = recordingState === "locked" ? "Locked • tap send or delete" : recordingState === "paused" ? "Paused • tap resume" : recordingState === "holding" ? "Hold to record • release to send" : "Release to send • swipe left to cancel";

  return (
    <div className="relative border-t border-slate-200 bg-white p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.04)]">
      {selectedFile ? (
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
          <span className="truncate">{selectedFile.name}</span>
          <button onClick={onClearFile} className="rounded-full p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700" aria-label="Remove selected file">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>
      ) : null}

      {replyTo ? (
        <div className="mb-3 flex items-start justify-between rounded-2xl border border-purple-200 bg-purple-50 px-3 py-2 shadow-sm">
          <div className="flex min-w-0 items-start gap-2">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-purple-700">
              {replyIcon}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-700">
                {replyTo.sender === "you" ? "You" : replyTo.sender === "stranger" ? "Stranger" : "System"}
              </div>
              {replyPreviewUrl ? (
                <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <img src={replyPreviewUrl} alt="Reply preview" className="h-14 w-full object-cover" />
                </div>
              ) : null}
              <div className="truncate text-sm text-slate-700">{replyPreviewText}</div>
            </div>
          </div>
          <button type="button" onClick={onCancelReply} className="rounded-full p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700" aria-label="Cancel reply">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {showPreview && voicePreviewUrl ? (
        <div className="mb-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Mic className="h-4 w-4 text-purple-600" /><span>Voice message</span></div>
            <div className="flex items-center gap-2">
              <button onClick={deleteVoice} className="rounded-full bg-red-500 px-3 py-1.5 text-sm font-medium text-white" aria-label="Delete voice message">Delete</button>
              <button onClick={handleSendVoice} className="rounded-full bg-purple-600 px-3 py-1.5 text-sm font-medium text-white" aria-label="Send voice message">Send</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white" aria-label="Play voice preview">▶</button>
            <div className="flex min-w-0 flex-1 items-end justify-center gap-1 overflow-hidden rounded-full bg-white/80 px-2 py-2">
              {Array.from({ length: 18 }).map((_, index) => (
                <span key={index} className="block h-4 w-1 rounded-full bg-purple-600/80" style={{ height: `${12 + ((index * 7) % 20)}px` }} />
              ))}
            </div>
            <div className="min-w-[72px] text-right text-xs font-semibold text-slate-700">00:00</div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        {!showPreview ? (
          <>
            <button type="button" onClick={() => setShowEmojiPicker((value) => !value)} className="rounded-full p-2 text-slate-600 transition hover:scale-110 hover:bg-slate-100" title="Emoji" aria-label="Open emoji picker">
              <Smile className="h-5 w-5" />
            </button>
            {showEmojiPicker ? (
              <div ref={pickerRef} className="absolute bottom-20 left-2 z-50">
                <EmojiPicker onSelect={addEmoji} />
              </div>
            ) : null}
            <FileAttachment onSelect={onFileSelect} disabled={isRecording || permissionPending} />
          </>
        ) : null}

        {isRecording || recordingState === "holding" ? (
          <div className={`flex flex-1 items-center justify-between gap-3 rounded-2xl border px-4 py-2 shadow-sm ${recordingState === "locked" ? "border-purple-200 bg-purple-50" : recordingState === "paused" ? "border-amber-200 bg-amber-50" : recordingState === "holding" ? "border-slate-300 bg-slate-50" : "border-red-200 bg-red-50"}`} onPointerDown={handleRecordingPointerDown} onPointerMove={handleRecordingPointerMove} onPointerUp={handleRecordingPointerUp} onPointerLeave={handleRecordingPointerUp} onPointerCancel={handleRecordingPointerUp} style={{ transform: `translateX(${dragOffset}px)`, transition: dragOffset === 0 ? "transform 160ms ease" : "none", opacity: dragOffset < 0 ? 0.9 : 1 }}>
            <div className="flex items-center gap-3">
              <button onClick={deleteVoice} className={`rounded-full p-2 shadow-sm ${recordingState === "locked" ? "bg-white text-purple-700" : recordingState === "paused" ? "bg-white text-amber-700" : recordingState === "holding" ? "bg-white text-slate-700" : "bg-white text-red-600"}`} aria-label="Delete recording"><Trash2 className="h-4 w-4" /></button>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                {recordingState === "locked" ? <Lock className="h-4 w-4 text-purple-700" /> : recordingState === "paused" ? <Pause className="h-4 w-4 text-amber-700" /> : recordingState === "holding" ? <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-slate-500" /> : <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />}
                <span className={recordingState === "locked" ? "text-purple-700" : recordingState === "paused" ? "text-amber-700" : recordingState === "holding" ? "text-slate-700" : "text-red-600"}>{recordingState === "locked" ? "Locked" : recordingState === "paused" ? "Paused" : recordingState === "holding" ? "Hold" : "Recording"}</span>
              </div>
              <span className={`text-sm font-medium ${recordingState === "locked" ? "text-purple-700" : recordingState === "paused" ? "text-amber-700" : recordingState === "holding" ? "text-slate-700" : "text-red-700"}`}>{String(Math.floor(recordingTime / 60)).padStart(2, "0")}:{String(recordingTime % 60).padStart(2, "0")}</span>
            </div>
            <div className="flex min-w-0 flex-1 items-end justify-center gap-1 overflow-hidden rounded-full bg-white/80 px-2 py-2">
              {recordingLevels.map((height, index) => <span key={`${height}-${index}`} className={`block w-1 rounded-full ${recordingState === "locked" ? "bg-purple-600" : recordingState === "paused" ? "bg-amber-600" : recordingState === "holding" ? "bg-slate-500" : "bg-red-500"}`} style={{ height: `${height}px`, opacity: 1, animation: `pulse 1s ease-in-out infinite ${index * 0.06}s` }} />)}
            </div>
            <div className={`flex items-center gap-2 text-xs font-semibold ${recordingState === "locked" ? "text-purple-700" : recordingState === "paused" ? "text-amber-700" : recordingState === "holding" ? "text-slate-700" : "text-red-600"}`}>
              {recordingState === "locked" ? <><Lock className="h-3.5 w-3.5" /><span>Tap send / delete</span></> : recordingState === "paused" ? <><Play className="h-3.5 w-3.5" /><span>Resume</span></> : recordingState === "holding" ? <><span>↔</span><span>{recordingHint}</span></> : <><span>↔</span><span>{recordingHint}</span></>}
            </div>
            {recordingState === "locked" ? (
              <div className="flex items-center gap-2">
                <button onClick={pauseRecording} className="rounded-full bg-white p-2 text-purple-700 shadow-sm" aria-label="Pause recording"><Pause className="h-4 w-4" /></button>
                <button onClick={handleSendVoice} className="rounded-full bg-purple-600 p-2 text-white" aria-label="Send recording"><SendHorizontal className="h-4 w-4" /></button>
              </div>
            ) : recordingState === "paused" ? (
              <button onClick={resumeRecording} className="rounded-full bg-amber-600 p-2 text-white" aria-label="Resume recording"><Play className="h-4 w-4" /></button>
            ) : (
              <button onClick={() => stopRecording(true)} className="rounded-full bg-purple-600 p-2 text-white" aria-label="Stop recording"><Mic className="h-4 w-4" /></button>
            )}
          </div>
        ) : !showPreview ? (
          <>
            <input ref={inputRef} type="text" value={message} onChange={(event) => onChange(event.target.value)} onKeyDown={handleInputKeyDown} placeholder="Type a message..." className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100" aria-label="Message input" disabled={isRecording} />
            <button type="button" onPointerDown={handleHoldStart} onPointerUp={handleHoldEnd} onPointerCancel={handleHoldEnd} onContextMenu={(event) => event.preventDefault()} onKeyDown={handleMicKeyDown} onKeyUp={handleMicKeyUp} className="select-none rounded-full p-2 text-slate-600 transition hover:scale-110 hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60" title="Hold to record" aria-label={isRecording ? "Stop recording voice message" : "Hold to record voice message"} aria-pressed={isRecording} disabled={permissionPending}><span className="text-xl">🎤</span></button>
            <button type="button" onClick={handleSend} className="rounded-full bg-purple-600 p-2.5 text-white transition hover:bg-purple-700" aria-label="Send message"><SendHorizontal className="h-4 w-4" /></button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default memo(MessageInput);
