"use client";

import { memo } from "react";

type MessageTimeProps = {
  time: string;
  isYou: boolean;
};

function MessageTime({ time, isYou }: MessageTimeProps) {
  return <span className={isYou ? "text-white/80" : "text-slate-400"}>{time}</span>;
}

export default memo(MessageTime);
