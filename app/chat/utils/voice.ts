export const waveformBars = [
  10, 18, 22, 14, 28, 16, 12, 24, 14, 20,
  10, 26, 18, 14, 30, 16, 12, 22,
];

export const formatRecordingTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  return `${mins}:${secs}`;
};

export const buildWaveformLevels = (
  analyserData: Uint8Array<ArrayBuffer> | null
) => {
  if (!analyserData) {
    return waveformBars;
  }

  return Array.from({ length: 18 }, (_, index) => {
    const start = Math.floor((index / 18) * analyserData.length);
    const end = Math.floor(((index + 1) / 18) * analyserData.length);
    const slice = analyserData.slice(start, end);
    const average = slice.reduce((total, value) => total + value, 0) / Math.max(slice.length, 1);

    return Math.max(10, Math.min(34, average / 2 + 10));
  });
};
