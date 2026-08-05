"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "../types/chat";

type ChatWindowProps = {
  messages: ChatMessage[];
  typing?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
  onReply?: (message: ChatMessage) => void;
  onReact?: (messageId: number, emoji: string) => void;
};

function ChatWindow({
  messages,
  typing = false,
  isLoading = false,
  emptyMessage = "Start a conversation...",
  onReply,
  onReact,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messageRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());
  const [highlightedMessageId, setHighlightedMessageId] = useState<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, typing, isLoading]);

  const handleQuoteClick = useCallback((messageId: number | null | undefined) => {
    if (!messageId) {
      return;
    }

    const node = messageRefs.current.get(messageId);
    if (!node) {
      return;
    }

    setHighlightedMessageId(messageId);
    node.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      setHighlightedMessageId((current) => (current === messageId ? null : current));
    }, 1600);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-950 p-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-[28px] bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[color:var(--surface)] p-6 text-center text-[color:var(--foreground)]">
        <div className="max-w-sm rounded-[32px] border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-6 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
          <p className="text-lg font-semibold text-[color:var(--foreground)]">{emptyMessage}</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">Connect with a new stranger and watch the conversation come alive in a secure chat space.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[color:var(--surface)] text-[color:var(--foreground)] p-4 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300 shadow-sm">
            Today
          </div>
        </div>

        {messages.map((message) => {
          const replyExists = messages.some((candidate) => candidate.id === message.replyTo?.id);

          return (
            <div
              key={message.id}
              ref={(node) => {
                messageRefs.current.set(message.id, node);
              }}
              className={`transition-all duration-300 ${highlightedMessageId === message.id ? "rounded-[24px] ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-950" : ""}`}
            >
              <MessageBubble
                message={message}
                onReply={onReply}
                onReact={onReact}
                onQuoteClick={handleQuoteClick}
                isHighlighted={highlightedMessageId === message.id}
                canFindOriginal={replyExists}
              />
            </div>
          );
        })}

        {typing ? (
          <div className="mb-4 flex justify-start" aria-live="polite">
            <div className="rounded-[24px] bg-slate-900 px-4 py-3 text-sm text-slate-300 shadow-sm">
              <span className="inline-flex gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-500" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-500 [animation-delay:120ms]" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-slate-500 [animation-delay:240ms]" />
              </span>
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default memo(ChatWindow);
