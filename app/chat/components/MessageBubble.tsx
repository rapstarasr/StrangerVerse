"use client";

import { memo, useMemo, useRef, useState } from "react";
import { FileText, Image, Mic, Paperclip } from "lucide-react";
import VoiceMessageBubble from "./VoiceMessageBubble";
import type { ChatMessage } from "../types/chat";
import { getReplyPreviewText, getReplyPreviewUrl } from "../utils/message";

const linkPattern = /(https?:\/\/[^\s]+)/g;

type MessageBubbleProps = {
  message: ChatMessage;
  onReply?: (message: ChatMessage) => void;
  onReact?: (messageId: number, emoji: string) => void;
  onQuoteClick?: (messageId?: number | null) => void;
  isHighlighted?: boolean;
  canFindOriginal?: boolean;
};

function TextBubble({ text, isYou }: { text: string; isYou: boolean }) {
  const parts = text.split(linkPattern);

  return (
    <p className={`whitespace-pre-wrap break-words text-[15px] leading-6 ${isYou ? "text-white" : "text-slate-200"}`}>
      {parts.map((part, index) => {
        if (!part) {
          return null;
        }

        if (part.match(/^https?:\/\//)) {
          return (
            <a
              key={`${part}-${index}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className={`break-all underline decoration-[rgba(34,211,238,0.35)] underline-offset-2 ${isYou ? "text-white/90" : "text-[#22D3EE]"}`}
            >
              {part}
            </a>
          );
        }

        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </p>
  );
}

function ImageBubble({ src, alt, isYou }: { src: string; alt: string; isYou: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[20px] border ${isYou ? "border-white/20 bg-[#0F172A]" : "border-[rgba(255,255,255,0.08)] bg-[#101827]"}`}>
      <img src={src} alt={alt} className="max-h-72 w-full object-cover" />
    </div>
  );
}

function FileBubble({ fileName, url, type, isYou }: { fileName: string; url: string; type: string; isYou: boolean }) {
  const label = type === "pdf" ? "Open PDF" : type === "video" ? "Open video" : "Open file";

  return (
    <div className={`max-w-[min(100%,320px)] rounded-[20px] border px-3 py-3 ${isYou ? "border-white/10 bg-[#111827]" : "border-[rgba(255,255,255,0.08)] bg-[#101827]"}`}>
      <div className={`mb-2 text-sm font-semibold ${isYou ? "text-white" : "text-slate-200"}`}>{fileName}</div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium transition hover:brightness-110 ${isYou ? "bg-[#8B5CF6] text-white" : "bg-[#22D3EE] text-slate-950"}`}
      >
        {label}
      </a>
    </div>
  );
}

function MessageFooter({ time, status, isYou }: { time?: string; status?: string; isYou: boolean }) {
  const statusLabel = status === "sending" ? "⏳" : status === "sent" ? "✓" : status === "delivered" ? "✓✓" : status === "seen" ? "👀" : status === "uploading" ? "⬆️" : status === "failed" ? "⚠️" : status === "retry" ? "↻" : status;

  return (
    <div className={`mt-2 flex items-center justify-end gap-1.5 text-[11px] leading-none ${isYou ? "text-white/70" : "text-slate-400"}`}>
      {time ? <span className={isYou ? "text-white/70" : "text-slate-400"}>{time}</span> : null}
      {status ? <span className={`min-w-[16px] text-center text-[11px] ${isYou ? "text-white/75" : "text-slate-400"}`}>{statusLabel}</span> : null}
    </div>
  );
}

const isVoiceFileName = (fileName: string) => {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".webm") || lower.endsWith(".ogg") || lower.endsWith(".m4a") || lower.endsWith(".wav") || lower.endsWith(".aac") || lower.endsWith(".mp3");
};

const isImageFileName = (fileName: string) => {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".gif") || lower.endsWith(".webp");
};

const isVideoFileName = (fileName: string) => {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm");
};

const resolveMessageShape = (text: string) => {
  const lines = text.split("\n");
  const firstLine = lines[0] ?? "";
  const secondLine = lines[1] ?? "";

  if (firstLine.startsWith("🎤 Voice Message")) {
    return { kind: "voice" as const, fileName: "", url: secondLine, payload: text };
  }

  if (!secondLine) {
    return { kind: "text" as const, fileName: "", url: "", payload: text };
  }

  if (firstLine.startsWith("📎 ")) {
    const fileName = firstLine.replace("📎 ", "");
    const lower = fileName.toLowerCase();

    if (isVoiceFileName(fileName)) {
      return { kind: "voice" as const, fileName, url: secondLine, payload: text };
    }

    if (isImageFileName(fileName)) {
      return { kind: "image" as const, fileName, url: secondLine, payload: text };
    }

    if (isVideoFileName(fileName)) {
      return { kind: "video" as const, fileName, url: secondLine, payload: text };
    }

    if (lower.endsWith(".pdf")) {
      return { kind: "pdf" as const, fileName, url: secondLine, payload: text };
    }

    return { kind: "file" as const, fileName, url: secondLine, payload: text };
  }

  return { kind: "text" as const, fileName: "", url: "", payload: text };
};

function MessageBubble({ message, onReply, onReact, onQuoteClick, isHighlighted = false, canFindOriginal = true }: MessageBubbleProps) {
  const isOutgoing = message.sender === "you";
  const isSystem = message.sender === "system";
  const resolved = useMemo(() => resolveMessageShape(message.text), [message.text]);
  const longPressTimerRef = useRef<number | null>(null);
  const [showReactions, setShowReactions] = useState(false);

  const renderBody = () => {
    if (resolved.kind === "voice") {
      return <VoiceMessageBubble src={resolved.url} sender={isOutgoing ? "you" : "stranger"} />;
    }

    if (resolved.kind === "image") {
      return <ImageBubble src={resolved.url} alt={resolved.fileName || "Image attachment"} isYou={isOutgoing} />;
    }

    if (resolved.kind === "video" || resolved.kind === "pdf" || resolved.kind === "file") {
      return <FileBubble fileName={resolved.fileName || "Attachment"} url={resolved.url} type={resolved.kind} isYou={isOutgoing} />;
    }

    return <TextBubble text={message.text} isYou={isOutgoing} />;
  };

  const handleReplyClick = () => {
    onReply?.(message);
  };

  const handleReactionSelect = (emoji: string) => {
    setShowReactions(false);
    onReact?.(message.id, emoji);
  };

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleLongPress = () => {
    clearLongPressTimer();
    longPressTimerRef.current = window.setTimeout(() => {
      setShowReactions(true);
    }, 420);
  };

  const handlePointerUp = () => {
    clearLongPressTimer();
  };

  const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];
  const reactionPopupStyle = { animation: "fadeIn 180ms ease-out" };

  const renderReplyPreview = () => {
    if (!message.replyTo) {
      return null;
    }

    const previewText = getReplyPreviewText(message.replyTo.text);
    const previewUrl = getReplyPreviewUrl(message.replyTo.text);
    const previewIcon = message.replyTo.type === "voice" ? <Mic className="h-3.5 w-3.5" /> : message.replyTo.type === "image" ? <Image className="h-3.5 w-3.5" /> : message.replyTo.type === "pdf" || message.replyTo.type === "file" || message.replyTo.type === "video" ? <FileText className="h-3.5 w-3.5" /> : <Paperclip className="h-3.5 w-3.5" />;

    return (
      <button
        type="button"
        onClick={() => onQuoteClick?.(message.replyTo?.id)}
        className={`mb-3 w-full rounded-[22px] border px-3 py-3 text-left shadow-sm transition ${isOutgoing ? "border-white/20 bg-[rgba(255,255,255,0.10)]" : "border-[rgba(255,255,255,0.08)] bg-[#101827]"}`}
      >
        <div className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${isOutgoing ? "text-white/70" : "text-slate-400"}`}>
          {message.replyTo.sender === "you" ? "You" : message.replyTo.sender === "stranger" ? "Stranger" : "System"}
        </div>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${isOutgoing ? "bg-[rgba(255,255,255,0.15)] text-white" : "bg-[rgba(255,255,255,0.05)] text-slate-100"}`}>
            {previewIcon}
          </div>
          <div className="min-w-0">
            {previewUrl ? (
              <div className="mb-2 overflow-hidden rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[#0F172A]">
                <img src={previewUrl} alt="Reply preview" className="h-14 w-full object-cover" />
              </div>
            ) : null}
            <div className={`text-sm ${isOutgoing ? "text-white" : "text-slate-300"}`}>
              {canFindOriginal ? previewText : "Original message unavailable"}
            </div>
          </div>
        </div>
      </button>
    );
  };

  if (isSystem) {
    return (
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-[rgba(255,255,255,0.08)] px-5 py-2 text-sm text-slate-100 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mb-4 flex ${isOutgoing ? "justify-end" : "justify-start"}`}
      onContextMenu={(event) => {
        event.preventDefault();
        setShowReactions(true);
      }}
      onPointerDown={handleLongPress}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="relative max-w-[min(100%,440px)]">
        <div className={`rounded-[32px] border border-[color:var(--border)] px-4 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 ${isOutgoing ? "bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#22D3EE] text-white shadow-[0_24px_80px_rgba(34,211,238,0.16)]" : "bg-[color:var(--surface)] text-slate-100"} ${isHighlighted ? "ring-2 ring-[#8B5CF6] ring-offset-2 ring-offset-[#070B17]" : ""}`}>
          <div className="flex justify-end">
            <button type="button" onClick={handleReplyClick} className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] ${isOutgoing ? "text-white/80" : "text-slate-400"}`}>
              Reply
            </button>
          </div>
          {renderReplyPreview()}
          {renderBody()}
        </div>
        {showReactions ? (
          <div style={reactionPopupStyle} className="absolute -top-14 left-0 z-20 flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[#090B17]/95 px-2 py-2 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all duration-200">
            {reactionEmojis.map((emoji) => (
              <button key={emoji} type="button" onClick={() => handleReactionSelect(emoji)} className="rounded-full px-2 py-1 text-lg transition hover:-translate-y-0.5 hover:scale-110">
                {emoji}
              </button>
            ))}
          </div>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-2">
          {(message.reactions ?? []).map((reaction) => {
            const reactedByMe = reaction.users.includes("you");
            return (
              <button
                key={reaction.emoji}
                type="button"
                onClick={() => handleReactionSelect(reaction.emoji)}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition ${reactedByMe ? "bg-[#8B5CF6] text-white" : "bg-[rgba(255,255,255,0.06)] text-slate-200"}`}
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.users.length}</span>
              </button>
            );
          })}
        </div>
        <MessageFooter time={message.time} status={message.status} isYou={isOutgoing} />
      </div>
    </div>
  );
}

export default memo(MessageBubble);
