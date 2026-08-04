"use client";

import { useCallback } from "react";
import type { UploadedFile } from "../types/chat";

const getApiUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (rawUrl) {
    return rawUrl.replace(/^http:/i, "https:");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
};

const API_URL = getApiUrl();

export function useUpload() {
  const uploadAttachment = useCallback(
    async (file: File | Blob, fileName: string): Promise<UploadedFile> => {
      const formData = new FormData();
      formData.append("file", file, fileName);

      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 30000);

      try {
        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`Upload failed (${response.status})`);
        }

        const result = await response.json();

        if (!result.success || !result.file) {
          throw new Error(result.message || "Upload failed");
        }

        return result.file as UploadedFile;
      } catch (error) {
        clearTimeout(timeout);

        if (error instanceof DOMException && error.name === "AbortError") {
          throw new Error("Upload timeout. Please try again.");
        }

        throw error;
      }
    },
    []
  );

  return {
    uploadAttachment,
  };
}