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
      <div className="flex-1 min-h-0 overflow-y-auto bg-[color:var(--surface)] p-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-[28px] bg-[color:var(--surface-muted)]" />
          ))}
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex-1 min-h-0 overflow-hidden bg-[color:var(--surface)] text-[color:var(--foreground)]">
        <div className="flex h-full min-h-[280px] items-center justify-center px-6 text-center">
          <p className="text-lg font-semibold text-slate-400">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[color:var(--surface)] text-[color:var(--foreground)] p-4 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {messages.map((message) => {
          const replyExists = messages.some((candidate) => candidate.id === message.replyTo?.id);

          return (
            <div
              key={message.id}
              ref={(node) => {
                messageRefs.current.set(message.id, node);
              }}
              className={`transition-all duration-300 ${highlightedMessageId === message.id ? "rounded-[24px] ring-2 ring-purple-400 ring-offset-2 ring-offset-[color:var(--surface)]" : ""}`}
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
            <div className="rounded-[24px] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-slate-400 shadow-[0_28px_80px_rgba(0,0,0,0.18)]">
              <span className="inline-flex gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8B5CF6]" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8B5CF6] [animation-delay:120ms]" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#8B5CF6] [animation-delay:240ms]" />
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
