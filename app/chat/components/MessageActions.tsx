"use client";

import { memo, useMemo, useState, type ReactNode } from "react";
import { useMessageActions } from "../hooks/useMessageActions";
import { CopyButton } from "./message/CopyButton";
import { DeleteDialog } from "./message/DeleteDialog";
import { ForwardDialog } from "./message/ForwardDialog";
import { MessageMenu } from "./message/MessageMenu";
import { PinButton } from "./message/PinButton";
import { ReactionPicker } from "./message/ReactionPicker";
import { ReplyPreview } from "./message/ReplyPreview";
import { StarButton } from "./message/StarButton";

type MessageActionsProps = {
  messageId: number;
  message?: string;
  sender?: "you" | "stranger" | "system";
  isMine?: boolean;
  isFailed?: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
  darkMode?: boolean;
  onReply?: (messageId: number) => void;
  onForward?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  onRetry?: (messageId: number) => void;
};

function MessageActions({
  messageId,
  message = "",
  sender = "you",
  isMine = true,
  isFailed = false,
  attachmentUrl,
  attachmentName,
  darkMode = true,
  onReply,
  onForward,
  onDelete,
  onRetry,
}: MessageActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactionOpen, setReactionOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const actions = useMessageActions({
    messageId,
    message,
    sender,
    isMine,
    isFailed,
    attachmentUrl,
    attachmentName,
    onReply,
    onForward,
    onDelete,
    onRetry,
  });

  const panelClass = useMemo(
    () => (darkMode ? "border-slate-700 bg-slate-900 text-slate-50" : "border-slate-200 bg-white text-slate-900"),
    [darkMode]
  );

  const renderMenu = (): ReactNode => {
    if (!menuOpen) return null;
    return (
      <div className={`absolute right-0 top-10 z-20 min-w-[220px] rounded-2xl border p-2 shadow-2xl ${panelClass}`}>
        <MessageMenu
          isMine={isMine}
          isFailed={isFailed}
          darkMode={darkMode}
          onReply={() => {
            actions.handleReply();
            setMenuOpen(false);
          }}
          onForward={() => {
            setForwardOpen(true);
            setMenuOpen(false);
          }}
          onCopy={() => {
            actions.handleCopy();
            setMenuOpen(false);
          }}
          onDelete={() => {
            setDeleteOpen(true);
            setMenuOpen(false);
          }}
          onPin={() => {
            actions.handlePin();
            setMenuOpen(false);
          }}
          onStar={() => {
            actions.handleStar();
            setMenuOpen(false);
          }}
          onReact={() => {
            setReactionOpen(true);
            setMenuOpen(false);
          }}
          onInfo={() => {
            actions.handleInfo();
            setMenuOpen(false);
          }}
          onShare={() => {
            actions.handleShare();
            setMenuOpen(false);
          }}
          onDownload={() => {
            actions.handleDownload();
            setMenuOpen(false);
          }}
          onRetry={() => {
            actions.handleRetry();
            setMenuOpen(false);
          }}
        />
      </div>
    );
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        type="button"
        className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${darkMode ? "bg-slate-800 text-slate-100 hover:bg-slate-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
        onClick={() => setMenuOpen((value) => !value)}
        onContextMenu={(event) => {
          event.preventDefault();
          setMenuOpen(true);
        }}
        onTouchStart={() => setMenuOpen(true)}
        aria-label="Open message actions"
      >
        ⋯
      </button>

      {renderMenu()}

      <CopyButton onCopy={actions.handleCopy} darkMode={darkMode} />
      <PinButton onPin={actions.handlePin} darkMode={darkMode} />
      <StarButton onStar={actions.handleStar} darkMode={darkMode} />

      <ReplyPreview message={message} isVisible={actions.replyActive} darkMode={darkMode} />

      <ReactionPicker
        isVisible={reactionOpen}
        onSelect={(emoji) => {
          actions.handleReact(emoji);
          setReactionOpen(false);
        }}
        darkMode={darkMode}
      />

      <ForwardDialog
        isVisible={forwardOpen}
        message={message}
        onClose={() => setForwardOpen(false)}
        onConfirm={() => {
          actions.handleForward();
          setForwardOpen(false);
        }}
        darkMode={darkMode}
      />

      <DeleteDialog
        isVisible={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          actions.handleDelete();
          setDeleteOpen(false);
        }}
        darkMode={darkMode}
      />
    </div>
  );
}

export default memo(MessageActions);
