export function formatDuration(ms: number | null): string {
  if (!ms) return "00:00";
  const totalSeconds = Math.floor((Date.now() - ms) / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function getConnectionLabel(state: string, isMuted: boolean, isCameraOff: boolean, networkQuality: number): string {
  if (state === "connected") {
    return `Connected · ${networkQuality}/5`;
  }
  if (state === "reconnecting") {
    return "Reconnecting";
  }
  if (isMuted) {
    return "Muted";
  }
  if (isCameraOff) {
    return "Camera off";
  }
  return "Connecting";
}

export function getNetworkLabel(quality: number): string {
  if (quality >= 4) return "Excellent";
  if (quality === 3) return "Good";
  if (quality === 2) return "Fair";
  return "Poor";
}
