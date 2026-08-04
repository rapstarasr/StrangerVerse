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
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-[20px] bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-sm rounded-[24px] border border-slate-200 bg-white px-6 py-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">{emptyMessage}</p>
          <p className="mt-2 text-sm text-slate-500">Messages will appear here as soon as the conversation starts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="mx-auto flex max-w-3xl flex-col">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm">
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
              className={`transition-all duration-300 ${highlightedMessageId === message.id ? "rounded-[24px] ring-2 ring-purple-400 ring-offset-2 ring-offset-gray-50" : ""}`}
            >
              <MessageBubble message={message} onReply={onReply} onReact={onReact} onQuoteClick={handleQuoteClick} isHighlighted={highlightedMessageId === message.id} canFindOriginal={replyExists} />
            </div>
          );
        })}

        {typing ? (
          <div className="mb-4 flex justify-start" aria-live="polite">
            <div className="rounded-[20px] bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:240ms]" />
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