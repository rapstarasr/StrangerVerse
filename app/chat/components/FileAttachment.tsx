"use client";

import { useRef } from "react";

type FileAttachmentProps = {
  onSelect: (file: File) => void;
  disabled?: boolean;
};

export default function FileAttachment({
  onSelect,
  disabled = false,
}: FileAttachmentProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onSelect(file);
          }

          // Same file dobara select ho sake
          e.currentTarget.value = "";
        }}
      />

      <button
        onClick={openFilePicker}
        disabled={disabled}
        aria-label="Attach file"
        className="text-2xl transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
        title="Attachment"
      >
        📎
      </button>
    </>
  );
}