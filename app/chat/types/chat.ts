export type ReplyType = "text" | "image" | "video" | "voice" | "pdf" | "file";

export type ReplyMetadata = {
  id: number;
  sender: "you" | "stranger" | "system";
  text: string;
  type: ReplyType;
};

export type MessageReaction = {
  emoji: string;
  users: Array<"you" | "stranger">;
};

export type ChatMessage = {
  id: number;
  sender: "you" | "stranger" | "system";
  text: string;
  time?: string;
  status?: "sending" | "sent" | "delivered" | "seen" | "uploading" | "failed" | "retry";
  replyTo?: ReplyMetadata;
  reactions?: MessageReaction[];
};

export type UploadedFile = {
  id?: number;
  originalName: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  replyTo?: ReplyMetadata;
};
