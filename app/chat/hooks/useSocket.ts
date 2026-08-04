"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  MessageReaction,
  ReplyMetadata,
  UploadedFile,
} from "../types/chat";

type SocketHandlers = {
  onStrangerFound?: () => void;

  onReceiveMessage?: (message: {
    id: number;
    text: string;
    replyTo?: ReplyMetadata;
  }) => void;

  onMessageSent?: (messageId: number) => void;
  onMessageDelivered?: (messageId: number) => void;
  onMessageSeen?: (messageId: number) => void;

  onReceiveFile?: (
    file: UploadedFile & { replyTo?: ReplyMetadata }
  ) => void;

  onReactionUpdate?: (payload: {
    messageId: number;
    reactions: MessageReaction[];
  }) => void;

  onPartnerLeft?: () => void;

  onTyping?: () => void;
  onStopTyping?: () => void;

  // ===========================
  // CALL EVENTS
  // ===========================

  onIncomingCall?: (data: unknown) => void;
  onCallAccepted?: () => void;
  onCallRejected?: () => void;
  onCallEnded?: () => void;
  onCallUnavailable?: () => void;

  onWebRTCOffer?: (offer: RTCSessionDescriptionInit) => void;
  onWebRTCAnswer?: (answer: RTCSessionDescriptionInit) => void;
  onWebRTCIce?: (candidate: RTCIceCandidateInit) => void;
};

export function useSocket(handlers: SocketHandlers = {}) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);

  const [status, setStatus] = useState("Disconnected");
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [typing, setTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        transports: ["websocket"],
      }
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocket(socket);
      setStatus("Connected");
    });

    socket.on("disconnect", () => {
      setSocket(null);
      setStatus("Disconnected");
    });

    socket.on("online-users", (count: number) => {
      setOnlineUsers(count);
    });

    socket.on("waiting", () => {
      setStatus("Searching...");
    });

    socket.on("stranger-found", () => {
      setStatus("Connected ✅");
      handlersRef.current.onStrangerFound?.();
    });

    socket.on("receive-message", (message) => {
      handlersRef.current.onReceiveMessage?.(message);
    });

    socket.on("message-sent", (messageId) => {
      handlersRef.current.onMessageSent?.(messageId);
    });

    socket.on("message-delivered", (messageId) => {
      handlersRef.current.onMessageDelivered?.(messageId);
    });

    socket.on("message-seen", (messageId) => {
      handlersRef.current.onMessageSeen?.(messageId);
    });

    socket.on("receive-file", (file) => {
      handlersRef.current.onReceiveFile?.(file);
    });

    socket.on("message-reaction", (payload) => {
      handlersRef.current.onReactionUpdate?.(payload);
    });

    socket.on("typing", () => {
      setTyping(true);
      handlersRef.current.onTyping?.();
    });

    socket.on("stop-typing", () => {
      setTyping(false);
      handlersRef.current.onStopTyping?.();
    });

    socket.on("partner-left", () => {
      setTyping(false);
      setStatus("Searching...");
      socket.emit("find-stranger");
      handlersRef.current.onPartnerLeft?.();
    });

    // ===========================
    // CALL EVENTS
    // ===========================

    socket.on("incoming-call", (data) => {
      handlersRef.current.onIncomingCall?.(data);
    });

    socket.on("call-accepted", () => {
      handlersRef.current.onCallAccepted?.();
    });

    socket.on("call-rejected", () => {
      handlersRef.current.onCallRejected?.();
    });

    socket.on("call-ended", () => {
      handlersRef.current.onCallEnded?.();
    });

    socket.on("call-unavailable", () => {
      handlersRef.current.onCallUnavailable?.();
    });

    socket.on("webrtc-offer", (offer) => {
      handlersRef.current.onWebRTCOffer?.(offer);
    });

    socket.on("webrtc-answer", (answer) => {
      handlersRef.current.onWebRTCAnswer?.(answer);
    });

    socket.on("webrtc-ice", (candidate) => {
      handlersRef.current.onWebRTCIce?.(candidate);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emit = useCallback((event: string, payload?: unknown) => {
    socketRef.current?.emit(event, payload);
  }, []);

  return {
    socketRef,
    socket,
    status,
    onlineUsers,
    typing,
    setTyping,
    setStatus,
    emit,
  };
}
