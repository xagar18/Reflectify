import { useEffect, useRef, useState } from "react";
import useStore from "../zustand/store";
import type { AttachedFile } from "./MessageInput";

export type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  attachments?: AttachedFile[];
  timestamp?: Date;
};

type ChatAreaProps = {
  messages: Message[];
  isTyping: boolean;
  isLoadingMessages?: boolean;
};

function ChatArea({ messages, isTyping, isLoadingMessages }: ChatAreaProps) {
  const { theme } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(
    null
  );

  const handleCopyMessage = async (msgId: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(msgId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleReadAloud = (msgId: number, text: string) => {
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Empty state or loading state
  if (isLoadingMessages) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1">
            <span
              className="h-3 w-3 animate-bounce rounded-full bg-emerald-500"
              style={{ animationDelay: "0ms" }}
            ></span>
            <span
              className="h-3 w-3 animate-bounce rounded-full bg-emerald-500"
              style={{ animationDelay: "150ms" }}
            ></span>
            <span
              className="h-3 w-3 animate-bounce rounded-full bg-emerald-500"
              style={{ animationDelay: "300ms" }}
            ></span>
          </div>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="max-w-md text-center">
          <p
            className={`mb-1 text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Start a conversation
          </p>
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}
          >
            Share what's on your mind
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={`scrollbar-thin flex-1 overflow-y-auto ${
        theme === "dark"
          ? "scrollbar-thumb-gray-600 scrollbar-track-gray-800/50 hover:scrollbar-thumb-gray-500"
          : "scrollbar-thumb-gray-400 scrollbar-track-gray-200/50 hover:scrollbar-thumb-gray-500"
      }`}
    >
      <div className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
        <div className="space-y-4 sm:space-y-6">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="group inline-block max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
                {/* Message bubble */}
                <div
                  className={`inline-block rounded-2xl px-4 py-2.5 transition-all duration-200 ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white"
                      : theme === "dark"
                        ? "bg-gray-800 text-gray-100"
                        : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div
                      className={`mb-3 flex flex-wrap gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.attachments.map(attachment => (
                        <div
                          key={attachment.id}
                          className={`group/attachment overflow-hidden rounded-xl border backdrop-blur-sm transition-all ${theme === "dark" ? "border-gray-600/50 bg-gray-800/50 hover:border-gray-500/70" : "border-gray-300/50 bg-white/50 hover:border-gray-400/70"}`}
                        >
                          {attachment.type === "image" && attachment.preview ? (
                            <div className="relative">
                              <img
                                src={attachment.preview}
                                alt={attachment.file.name}
                                className="max-h-48 max-w-full cursor-pointer rounded-xl object-cover transition-transform group-hover/attachment:scale-105"
                                onClick={() =>
                                  window.open(attachment.preview, "_blank")
                                }
                              />
                              <div className="absolute inset-0 rounded-xl bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover/attachment:opacity-100"></div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
                              >
                                <svg
                                  className={`h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`truncate text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}
                                >
                                  {attachment.file.name}
                                </p>
                                <p
                                  className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  {formatFileSize(attachment.file.size)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message text */}
                  {msg.text && (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap sm:text-base">
                      {msg.text.split("\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < msg.text.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                {msg.text && (
                  <div
                    className={`mt-1.5 flex items-center gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Copy button */}
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      title={copiedMessageId === msg.id ? "Copied!" : "Copy"}
                      className={`rounded-md p-1.5 transition-colors ${
                        copiedMessageId === msg.id
                          ? "text-emerald-500"
                          : theme === "dark"
                            ? "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                            : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                      }`}
                    >
                      {copiedMessageId === msg.id ? (
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>

                    {/* Read aloud button */}
                    <button
                      onClick={() => handleReadAloud(msg.id, msg.text)}
                      title={
                        speakingMessageId === msg.id
                          ? "Stop reading"
                          : "Read aloud"
                      }
                      className={`rounded-md p-1.5 transition-colors ${
                        speakingMessageId === msg.id
                          ? "text-emerald-500"
                          : theme === "dark"
                            ? "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                            : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                      }`}
                    >
                      {speakingMessageId === msg.id ? (
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`mt-1 px-1 text-xs ${
                    theme === "dark" ? "text-gray-600" : "text-gray-400"
                  } ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  {msg.timestamp
                    ? formatTime(msg.timestamp)
                    : formatTime(new Date())}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className="animate-pulse text-sm">typing</span>
                <div className="flex items-center gap-0.5">
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
