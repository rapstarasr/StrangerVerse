"use client";

import { useCallback, useEffect, useState } from "react";

type MediaDeviceState = {
  devices: { audioInputs: string[]; videoInputs: string[] };
  hasPermission: boolean;
  permissionError: string | null;
  requestPermissions: () => Promise<void>;
};

export function useMediaDevices(): MediaDeviceState {
  const [devices, setDevices] = useState({ audioInputs: [] as string[], videoInputs: [] as string[] });
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const requestPermissions = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermissionError("Media devices are unavailable in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach((track) => track.stop());
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = deviceList.filter((device) => device.kind === "audioinput").map((device) => device.label || "Microphone");
      const videoInputs = deviceList.filter((device) => device.kind === "videoinput").map((device) => device.label || "Camera");
      setDevices({ audioInputs, videoInputs });
      setHasPermission(true);
      setPermissionError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to access camera and microphone.";
      setPermissionError(message);
      setHasPermission(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void requestPermissions();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [requestPermissions]);

  return { devices, hasPermission, permissionError, requestPermissions };
}
