"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, MessageReaction, ReplyMetadata, UploadedFile } from "../types/chat";
import { getReplyMetadata, getTimeLabel } from "../utils/message";
import { useSocket } from "./useSocket";
import { useUpload } from "./useUpload";

export type CallMode = "audio" | "video";
export type CallSession = {
  mode: CallMode;
  direction: "incoming" | "outgoing";
  accepted: boolean;
};

export function useChat() {
  const messageIdCounterRef = useRef(0);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyTo, setReplyTo] = useState<ReplyMetadata | null>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);

  const { uploadAttachment } = useUpload();
  const emitRef = useRef<((event: string, ...args: unknown[]) => void) | null>(null);
  const typingRef = useRef<((value: boolean) => void) | null>(null);

  const createMessageId = useCallback(() => {
    const baseTime = Date.now();
    const id = baseTime * 1000 + messageIdCounterRef.current;
    messageIdCounterRef.current += 1;
    return id;
  }, []);

  const appendMessage = useCallback((entry: ChatMessage) => {
    setMessages((prev) => [...prev, entry]);
  }, []);

  const updateMessageStatus = useCallback((messageId: number, nextStatus: ChatMessage["status"]) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status: nextStatus } : msg)));
  }, []);

  const updateMessageReactions = useCallback((messageId: number, reactions: MessageReaction[]) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, reactions } : msg)));
  }, []);

  const resetConversation = useCallback(() => {
    setMessages([]);
    setSelectedFile(null);
    setVoiceBlob(null);
    setReplyTo(null);
    setMessage("");
  }, []);

  const socketHandlers = {
    onStrangerFound: useCallback(() => {
      appendMessage({
        id: createMessageId(),
        sender: "system",
        text: "✅ Stranger Connected",
      });
    }, [appendMessage, createMessageId]),

    onReceiveMessage: useCallback(
      (incomingMessage: { id: number; text: string; replyTo?: ReplyMetadata }) => {
        appendMessage({
          id: incomingMessage.id,
          sender: "stranger",
          text: incomingMessage.text,
          time: getTimeLabel(),
          replyTo: incomingMessage.replyTo,
        });

        if (emitRef.current) {
          emitRef.current("message-delivered", incomingMessage.id);
          emitRef.current("message-seen", incomingMessage.id);
        }
      },
      [appendMessage]
    ),

    onMessageSent: useCallback((messageId: number) => updateMessageStatus(messageId, "sent"), [updateMessageStatus]),
    onMessageDelivered: useCallback((messageId: number) => updateMessageStatus(messageId, "delivered"), [updateMessageStatus]),
    onMessageSeen: useCallback((messageId: number) => updateMessageStatus(messageId, "seen"), [updateMessageStatus]),

    onReceiveFile: useCallback(
      (file: UploadedFile & { replyTo?: ReplyMetadata }) => {
        appendMessage({
          id: file.id ?? createMessageId(),
          sender: "stranger",
          text: `📎 ${file.originalName}\n${file.url}`,
          time: getTimeLabel(),
          replyTo: file.replyTo,
        });
      },
      [appendMessage, createMessageId]
    ),

    onReactionUpdate: useCallback(
      ({ messageId, reactions }: { messageId: number; reactions: MessageReaction[] }) => {
        updateMessageReactions(messageId, reactions);
      },
      [updateMessageReactions]
    ),

    onPartnerLeft: useCallback(() => {
      setActiveCall(null);
      if (typingRef.current) {
        typingRef.current(false);
      }
    }, []),

    onIncomingCall: useCallback((data: unknown) => {
      const mode = typeof data === "object" && data !== null && (data as { mode?: unknown }).mode === "audio" ? "audio" : "video";
      setActiveCall((current) => current ?? { mode, direction: "incoming", accepted: false });
    }, []),

    onCallAccepted: useCallback(() => {
      setActiveCall((current) => current?.direction === "outgoing" ? { ...current, accepted: true } : current);
    }, []),

    onCallRejected: useCallback(() => setActiveCall(null), []),
    onCallEnded: useCallback(() => setActiveCall(null), []),
    onCallUnavailable: useCallback(() => setActiveCall(null), []),
  };

  const { socket, status, onlineUsers, typing, setTyping, emit } = useSocket(socketHandlers);

  useEffect(() => {
    emitRef.current = emit;
    typingRef.current = setTyping;
  }, [emit, setTyping]);

  const stopTyping = useCallback(() => {
    setTyping(false);
  }, [setTyping]);

  const findStranger = useCallback(() => {
    if (activeCall) emit("end-call");
    setActiveCall(null);
    resetConversation();
    stopTyping();
    emit("find-stranger");
  }, [activeCall, emit, resetConversation, stopTyping]);

  const nextStranger = useCallback(() => {
    if (activeCall) emit("end-call");
    setActiveCall(null);
    resetConversation();
    stopTyping();
    emit("next");
  }, [activeCall, emit, resetConversation, stopTyping]);

  const startCall = useCallback((mode: CallMode) => {
    if (!status.startsWith("Connected") || activeCall) return;
    setActiveCall({ mode, direction: "outgoing", accepted: false });
    emit("call-user", { mode });
  }, [activeCall, emit, status]);

  const acceptCall = useCallback(() => {
    if (activeCall?.direction !== "incoming") return;
    emit("accept-call");
    setActiveCall({ ...activeCall, accepted: true });
  }, [activeCall, emit]);

  const rejectCall = useCallback(() => {
    emit("reject-call");
    setActiveCall(null);
  }, [emit]);

  const endCall = useCallback(() => {
    emit("end-call");
    setActiveCall(null);
  }, [emit]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleVoiceRecorded = useCallback((blob: Blob | null) => {
    setVoiceBlob(blob);
  }, []);

  const handleReply = useCallback((message: ChatMessage) => {
    setReplyTo(getReplyMetadata(message));
  }, []);

  const clearReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const handleReactToMessage = useCallback(
    (messageId: number, emoji: string) => {
      setMessages((prev) => {
        const nextMessages = prev.map((message) => {
          if (message.id !== messageId) {
            return message;
          }

          const existingReactions: MessageReaction[] = message.reactions ?? [];
          const existingReaction = existingReactions.find((reaction) => reaction.emoji === emoji);
          const hasCurrentUser = existingReaction?.users.includes("you") ?? false;

          const nextReactions: MessageReaction[] = existingReactions
            .map((reaction): MessageReaction => {
              const currentUsers: Array<"you" | "stranger"> = reaction.users.filter((user): user is "you" | "stranger" => user === "you" || user === "stranger");
              const filteredUsers = currentUsers.filter((user) => user !== "you");
              if (reaction.emoji === emoji) {
                if (hasCurrentUser) {
                  return { ...reaction, users: filteredUsers };
                }
                return { ...reaction, users: [...filteredUsers, "you"] };
              }

              if (currentUsers.length !== reaction.users.length) {
                return { ...reaction, users: filteredUsers };
              }

              return reaction;
            })
            .filter((reaction) => reaction.users.length > 0);

          if (!existingReaction) {
            nextReactions.push({ emoji, users: ["you"] });
          }

          return {
            ...message,
            reactions: nextReactions,
          };
        });

        const updatedMessage = nextMessages.find((message) => message.id === messageId);
        if (updatedMessage) {
          emitRef.current?.("message-reaction", {
            messageId,
            reactions: updatedMessage.reactions ?? [],
          });
        }

        return nextMessages;
      });
    },
    []
  );

  const handleTyping = useCallback(
    (value: string) => {
      setMessage(value);

      if (value.trim()) {
        emit("typing");
      } else {
        emit("stop-typing");
      }
    },
    [emit]
  );

  const sendMessage = useCallback(async () => {
    const trimmedMessage = message.trim();
    const hasText = trimmedMessage.length > 0;
    const hasAttachment = Boolean(selectedFile || voiceBlob);

    if (!hasText && !hasAttachment) {
      return;
    }

    const messageId = createMessageId();
    const attachment = selectedFile ?? voiceBlob;
    const isVoiceAttachment = Boolean(!selectedFile && voiceBlob);
    const previewVoiceUrl = isVoiceAttachment && voiceBlob ? URL.createObjectURL(voiceBlob) : null;
    const fileName = selectedFile?.name ?? `voice-message-${messageId}.webm`;
    const attachmentLabel = selectedFile ? `📎 ${selectedFile.name}` : "🎤 Voice Message";
    const optimisticText = isVoiceAttachment
      ? `🎤 Voice Message\n${previewVoiceUrl ?? ""}`
      : hasText
        ? hasAttachment
          ? `${trimmedMessage}\n${attachmentLabel}`
          : trimmedMessage
        : attachmentLabel;
    const replyPayload = replyTo ? { ...replyTo } : undefined;

    appendMessage({
      id: messageId,
      sender: "you",
      text: optimisticText,
      time: getTimeLabel(),
      status: "sending",
      replyTo: replyPayload,
    });

    if (hasText) {
      emit("send-message", { id: messageId, text: trimmedMessage, replyTo: replyPayload });
      emit("stop-typing");
    }

    if (attachment) {
      try {
        const uploadedFile = await uploadAttachment(attachment, fileName);

        if (isVoiceAttachment && previewVoiceUrl) {
          URL.revokeObjectURL(previewVoiceUrl);
        }

        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, text: isVoiceAttachment ? `🎤 Voice Message\n${uploadedFile.url}` : msg.text } : msg))
        );

        emit("send-file", {
          ...uploadedFile,
          id: messageId,
          replyTo: replyPayload,
        });

        setSelectedFile(null);
        setVoiceBlob(null);
      } catch (error) {
        console.error(error);
        alert("Upload failed");
      }
    }

    if (hasText) {
      setMessage("");
    }

    setReplyTo(null);
  }, [appendMessage, createMessageId, emit, message, replyTo, selectedFile, uploadAttachment, voiceBlob]);

  return {
    status,
    onlineUsers,
    typing,
    message,
    selectedFile,
    voiceBlob,
    messages,
    replyTo,
    activeCall,
    socket,
    setMessage,
    setSelectedFile,
    setVoiceBlob,
    findStranger,
    nextStranger,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    handleFileSelect,
    handleVoiceRecorded,
    handleReply,
    clearReply,
    handleReactToMessage,
    handleTyping,
    sendMessage,
    clearSelectedFile: () => setSelectedFile(null),
  };
}
