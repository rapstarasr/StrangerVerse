"use client";

import { memo } from "react";

type MessageStatusProps = {
  status?: "sending" | "sent" | "delivered" | "seen" | "uploading" | "failed" | "retry";
  isYou: boolean;
};

function MessageStatus({ status, isYou }: MessageStatusProps) {
  if (!status) {
    return null;
  }

  const statusLabel = {
    sending: "⏳",
    sent: "✓",
    delivered: "✓✓",
    seen: "👀",
    uploading: "⬆️",
    failed: "⚠️",
    retry: "↻",
  }[status];

  return <span className={`min-w-[16px] text-center text-[11px] ${isYou ? "text-white/85" : "text-slate-500"}`}>{statusLabel}</span>;
}

export default memo(MessageStatus);
