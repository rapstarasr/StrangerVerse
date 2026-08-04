"use client";

type HeaderProps = {
  typing: boolean;
};

export default function Header({ typing }: HeaderProps) {
  return (
    <div className="border-b border-gray-800 bg-gray-950 text-white p-5">

      <h2 className="text-2xl font-bold">
  StrangerVerse – Anonymous Random Stranger Chat
</h2>

      <p className="text-gray-400 mt-1">
  Meet new people instantly through secure anonymous text, voice and video chat. No registration required.
</p>

      {typing && (
        <div className="flex items-center gap-2 mt-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></span>
            <span
              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            ></span>
            <span
              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.30s" }}
            ></span>
          </div>

          <span className="text-green-400 text-sm">
            Stranger is typing...
          </span>
        </div>
      )}

    </div>
  );
}