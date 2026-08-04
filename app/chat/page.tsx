"use client";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import VideoCall from "./components/VideoCall";
import { useChat } from "./hooks/useChat";

export default function ChatPage() {
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
    <div className="relative flex h-screen bg-gray-100">
      <Sidebar
        onlineUsers={onlineUsers}
        status={status}
        onFindStranger={findStranger}
        onNext={nextStranger}
        onVoiceCall={() => startCall("audio")}
        onVideoCall={() => startCall("video")}
      />

      <div className="flex flex-1 flex-col">
        <Header typing={typing} />

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
      </div>

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
