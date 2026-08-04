export function getActionSummary(message: string, isMine: boolean) {
  return {
    label: isMine ? "Your message" : "Incoming message",
    preview: message.slice(0, 40) || "Empty message",
  };
}
