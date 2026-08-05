'use client';

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import VideoCall from "./components/VideoCall";
import { useChat } from "./hooks/useChat";

export default function ChatClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    status,
    onlineUsers,
    typing,
    message,
    selectedFile,
    messages,
    findStranger,
    nextStranger,
    handleFileSelect,
    handleVoiceRecorded,
    handleReply,
    clearReply,
    handleReactToMessage,
    handleTyping,
    sendMessage,
    clearSelectedFile,
    replyTo,
    activeCall,
    socket,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
  } = useChat();

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.14),transparent_30%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.12),transparent_35%),var(--background)] text-[color:var(--foreground)] md:flex-row">
      <Sidebar
        onlineUsers={onlineUsers}
        status={status}
        onFindStranger={findStranger}
        onNext={nextStranger}
        onVoiceCall={() => startCall("audio")}
        onVideoCall={() => startCall("video")}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-h-0 flex-1 flex-col">
        <Header
          typing={typing}
          onlineUsers={onlineUsers}
          status={status}
          onOpenSidebar={() => setSidebarOpen(true)}
          onVoiceCall={() => startCall("audio")}
          onVideoCall={() => startCall("video")}
        />

        <ChatWindow messages={messages} typing={typing} onReply={handleReply} onReact={handleReactToMessage} />

        <MessageInput
          message={message}
          selectedFile={selectedFile}
          onChange={handleTyping}
          onSend={sendMessage}
          onFileSelect={handleFileSelect}
          onClearFile={clearSelectedFile}
          onVoiceRecorded={handleVoiceRecorded}
          replyTo={replyTo}
          onCancelReply={clearReply}
        />
      </main>

      {activeCall ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-5xl">
            <VideoCall
              title={activeCall.mode === "audio" ? "Voice Call" : "Video Call"}
              initialMode={activeCall.mode}
              direction={activeCall.direction}
              accepted={activeCall.accepted}
              socket={socket}
              darkMode
              onAccept={acceptCall}
              onDecline={rejectCall}
              onEnd={endCall}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
