"use client";

import { memo } from "react";
import MessageStatus from "./MessageStatus";
import MessageTime from "./MessageTime";

type MessageFooterProps = {
  time?: string;
  status?: "sending" | "sent" | "delivered" | "seen" | "uploading" | "failed" | "retry";
  isYou: boolean;
};

function MessageFooter({ time, status, isYou }: MessageFooterProps) {
  return (
    <div className={`mt-2 flex items-center justify-end gap-1.5 text-[11px] leading-none ${isYou ? "text-white/80" : "text-slate-500"}`}>
      {time ? <MessageTime time={time} isYou={isYou} /> : null}
      <MessageStatus status={status} isYou={isYou} />
    </div>
  );
}

export default memo(MessageFooter);
