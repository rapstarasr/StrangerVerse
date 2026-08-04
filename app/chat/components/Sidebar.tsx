"use client";

type SidebarProps = {
  onlineUsers: number;
  status: string;
  onFindStranger: () => void;
  onNext: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
};

export default function Sidebar({
  onlineUsers,
  status,
  onFindStranger,
  onNext,
  onVoiceCall,
  onVideoCall,
}: SidebarProps) {
  return (
    <aside className="w-72 border-r border-gray-800 bg-gray-950 text-white p-5 flex flex-col">

      <h1 className="text-4xl font-bold text-purple-500">
        StrangerVerse
      </h1>

      <button
        onClick={onFindStranger}
        className="mt-10 bg-gradient-to-r from-fuchsia-600 to-purple-700 py-4 rounded-xl font-semibold hover:scale-105 transition"
      >
        🔍 Find Stranger
      </button>

      <button
        onClick={onNext}
        className="mt-4 bg-red-600 hover:bg-red-700 py-4 rounded-xl font-semibold transition"
      >
        ⏭ Next
      </button>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onVoiceCall}
          className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-purple-500 hover:text-white"
        >
          🎙 Voice Call
        </button>
        <button
          type="button"
          onClick={onVideoCall}
          className="rounded-xl border border-purple-600/40 bg-purple-600/10 px-3 py-2 text-sm font-medium text-purple-200 transition hover:bg-purple-600/20"
        >
          📹 Video Call
        </button>
      </div>

      <div className="mt-10 space-y-3 text-lg">
        <p>
          🟢 Online Users:
          <span className="font-bold ml-2">
            {onlineUsers}
          </span>
        </p>

        <p>
          Status:
          <span className="font-bold ml-2 text-green-400">
            {status}
          </span>
        </p>
      </div>

      <div className="mt-auto text-sm text-gray-500">
        StrangerVerse v2
      </div>

    </aside>
  );
}