import { Copy } from "lucide-react";
import { useEffect, useRef } from "react";
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
};

function ChatArea({ messages, isTyping }: ChatAreaProps) {
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

  const handleCopyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center">
        <div>
          <h2
            className={`mb-2 text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Welcome to Reflectify ✨
          </h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            This is a safe space to pause, reflect, and gently understand your
            thoughts.
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
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="group inline-block max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
                {/* Message bubble */}
                <div
                  className={`inline-block rounded-2xl px-4 py-2.5 transition-all duration-200 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : theme === "dark"
                        ? "bg-gray-700 text-gray-100"
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
                    <p className="text-sm leading-relaxed sm:text-base">
                      {msg.text}
                    </p>
                  )}
                </div>

                {/* Copy button - only for user messages */}
                {msg.sender === "user" && (
                  <div className="mt-2 flex justify-end opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <button
                      onClick={() => handleCopyMessage(msg.text)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                        theme === "dark"
                          ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                          : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                      }`}
                      title="Copy message"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </button>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`mt-1 px-2 text-xs ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  } ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  {msg.timestamp
                    ? formatTime(msg.timestamp)
                    : formatTime(new Date())}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
