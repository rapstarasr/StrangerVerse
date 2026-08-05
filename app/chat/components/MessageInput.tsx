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
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-[color:var(--border)] bg-[color:var(--surface)]/95 px-4 py-3 shadow-[0_-20px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      {selectedFile ? (
        <div className="mb-3 flex items-center justify-between gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--foreground)]">
          <span className="truncate font-medium text-[color:var(--foreground)]">{selectedFile.name}</span>
          <button
            onClick={onClearFile}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)]"
            aria-label="Remove selected file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-3 rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </div>
      ) : null}

      {replyTo ? (
        <div className="mb-3 rounded-3xl border border-violet-500/20 bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--foreground)] shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
                {replyIcon}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-200">Replying to {replyTo.sender === "you" ? "you" : replyTo.sender === "stranger" ? "stranger" : "system"}</p>
                <p className="mt-1 truncate text-sm text-slate-400">{replyPreviewText}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancelReply}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-muted)]"
              aria-label="Cancel reply"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {showPreview && voicePreviewUrl ? (
        <div className="mb-3 rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-4 shadow-sm">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--foreground)]">
              <Mic className="h-4 w-4 text-violet-400" />
              <span>Voice message</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={deleteVoice} className="rounded-full bg-rose-500 px-3 py-1.5 text-sm font-medium text-white" aria-label="Delete voice message">
                Delete
              </button>
              <button onClick={handleSendVoice} className="rounded-full bg-violet-500 px-3 py-1.5 text-sm font-medium text-white" aria-label="Send voice message">
                Send
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-3xl bg-[color:var(--surface)] px-3 py-3">
            <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500 text-white" aria-label="Play voice preview">
              ▶
            </button>
            <div className="flex min-w-0 flex-1 items-end gap-1 overflow-hidden rounded-full bg-slate-950 px-2 py-2">
              {Array.from({ length: 15 }).map((_, index) => (
                <span key={index} className="block w-1 rounded-full bg-violet-400/80" style={{ height: `${10 + ((index * 7) % 18)}px` }} />
              ))}
            </div>
            <div className="min-w-[72px] text-right text-xs font-semibold text-slate-400">00:00</div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((value) => !value)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)]"
          title="Emoji"
          aria-label="Open emoji picker"
        >
          <Smile className="h-5 w-5" />
        </button>
        {showEmojiPicker ? (
          <div ref={pickerRef} className="absolute bottom-20 left-4 z-50">
            <EmojiPicker onSelect={addEmoji} />
          </div>
        ) : null}
        <FileAttachment onSelect={onFileSelect} disabled={isRecording || permissionPending} />
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type a message..."
          className="min-w-0 flex-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none placeholder:text-slate-500 transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
          aria-label="Message input"
          disabled={isRecording}
        />
        <button
          type="button"
          onPointerDown={handleHoldStart}
          onPointerUp={handleHoldEnd}
          onPointerCancel={handleHoldEnd}
          onContextMenu={(event) => event.preventDefault()}
          onKeyDown={handleMicKeyDown}
          onKeyUp={handleMicKeyUp}
          className="select-none inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--foreground)] transition hover:bg-[color:var(--surface)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          title="Hold to record"
          aria-label={isRecording ? "Stop recording voice message" : "Hold to record voice message"}
          aria-pressed={isRecording}
          disabled={permissionPending}
        >
          <span className="text-xl">🎤</span>
        </button>
        <button
          type="button"
          onClick={handleSend}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-white transition hover:shadow-lg"
          aria-label="Send message"
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default memo(MessageInput);
