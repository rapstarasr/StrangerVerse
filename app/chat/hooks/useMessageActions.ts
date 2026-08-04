"use client";

import { useCallback, useMemo, useState } from "react";

type UseMessageActionsProps = {
  messageId: number;
  message: string;
  sender?: "you" | "stranger" | "system";
  isMine?: boolean;
  isFailed?: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
  onReply?: (messageId: number) => void;
  onForward?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  onRetry?: (messageId: number) => void;
};

export function useMessageActions({
  messageId,
  message,
  isMine = true,
  isFailed = false,
  attachmentUrl,
  attachmentName,
  onReply,
  onForward,
  onDelete,
  onRetry,
}: UseMessageActionsProps) {
  const [replyActive, setReplyActive] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [starred, setStarred] = useState(false);

  const handleReply = useCallback(() => {
    setReplyActive(true);
    onReply?.(messageId);
  }, [messageId, onReply]);

  const handleForward = useCallback(() => {
    onForward?.(messageId);
  }, [messageId, onForward]);

  const handleCopy = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(message);
    }
  }, [message]);

  const handleDelete = useCallback(() => {
    onDelete?.(messageId);
  }, [messageId, onDelete]);

  const handlePin = useCallback(() => {
    setPinned((value) => !value);
  }, []);

  const handleStar = useCallback(() => {
    setStarred((value) => !value);
  }, []);

  const handleReact = useCallback((emoji: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("message-react", { detail: { messageId, emoji } }));
    }
  }, [messageId]);

  const handleInfo = useCallback(() => {
    if (typeof window !== "undefined") {
      window.alert(`Message info for #${messageId}`);
    }
  }, [messageId]);

  const handleShare = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: "Shared message", text: message });
    }
  }, [message]);

  const handleDownload = useCallback(() => {
    if (!attachmentUrl) return;
    const link = document.createElement("a");
    link.href = attachmentUrl;
    link.download = attachmentName ?? "attachment";
    link.click();
  }, [attachmentName, attachmentUrl]);

  const handleRetry = useCallback(() => {
    onRetry?.(messageId);
  }, [messageId, onRetry]);

  return useMemo(
    () => ({
      replyActive,
      pinned,
      starred,
      isMine,
      isFailed,
      handleReply,
      handleForward,
      handleCopy,
      handleDelete,
      handlePin,
      handleStar,
      handleReact,
      handleInfo,
      handleShare,
      handleDownload,
      handleRetry,
    }),
    [handleCopy, handleDelete, handleDownload, handleForward, handleInfo, handlePin, handleReact, handleReply, handleRetry, handleShare, handleStar, isFailed, isMine, pinned, replyActive, starred]
  );
}
