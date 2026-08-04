import type { ChatMessage, ReplyMetadata, ReplyType } from "../types/chat";

const isVoiceFileName = (fileName: string) => {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".webm") || lower.endsWith(".ogg") || lower.endsWith(".m4a") || lower.endsWith(".wav") || lower.endsWith(".aac") || lower.endsWith(".mp3");
};

const isImageFileName = (fileName: string) => {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".gif") || lower.endsWith(".webp");
};

const isVideoFileName = (fileName: string) => {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.endsWith(".webm");
};

export const getTimeLabel = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export const getMessageReplyType = (text: string): ReplyType => {
  const lines = text.split("\n");
  const firstLine = lines[0] ?? "";

  if (firstLine.startsWith("🎤 Voice Message")) {
    return "voice";
  }

  if (firstLine.startsWith("📎 ")) {
    const fileName = firstLine.replace("📎 ", "");
    const lower = fileName.toLowerCase();

    if (isVoiceFileName(fileName)) {
      return "voice";
    }

    if (isImageFileName(fileName)) {
      return "image";
    }

    if (isVideoFileName(fileName)) {
      return "video";
    }

    if (lower.endsWith(".pdf")) {
      return "pdf";
    }

    return "file";
  }

  return "text";
};

export const getReplyPreviewText = (text: string) => {
  const firstLine = text.split("\n")[0]?.trim() ?? "";

  if (!firstLine) {
    return "Message";
  }

  if (firstLine.startsWith("🎤 Voice Message")) {
    return "Voice message";
  }

  if (firstLine.startsWith("📎 ")) {
    return firstLine.replace("📎 ", "");
  }

  return firstLine;
};

export const getReplyPreviewUrl = (text: string) => {
  const lines = text.split("\n");
  const firstLine = lines[0] ?? "";
  const secondLine = lines[1] ?? "";

  if (!firstLine.startsWith("📎 ")) {
    return "";
  }

  const fileName = firstLine.replace("📎 ", "");
  if (!isImageFileName(fileName)) {
    return "";
  }

  return secondLine;
};

export const getReplyMetadata = (message: Pick<ChatMessage, "id" | "sender" | "text">): ReplyMetadata => ({
  id: message.id,
  sender: message.sender,
  text: message.text,
  type: getMessageReplyType(message.text),
});
