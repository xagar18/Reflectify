import { useEffect, useRef, useState } from "react";
import useStore from "../zustand/store";

export type AttachedFile = {
  id: number;
  file: File;
  preview?: string;
  type: "image" | "file";
};

type MessageInputProps = {
  onSend: (text: string, attachments?: AttachedFile[]) => void;
  autoFocusTrigger?: number;
  disabled?: boolean;
};

function MessageInput({
  onSend,
  autoFocusTrigger,
  disabled,
}: MessageInputProps) {
  const { theme } = useStore();
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check for voice support
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join("");
        setInput(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [autoFocusTrigger]);

  const handleSend = () => {
    if (disabled) return;
    if (!input.trim() && attachments.length === 0) return;
    onSend(input, attachments.length > 0 ? attachments : undefined);
    setInput("");
    setAttachments([]);
    // Re-focus input after sending
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: AttachedFile[] = [];

    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith("image/");
      const attachment: AttachedFile = {
        id: Date.now() + Math.random(),
        file,
        type: isImage ? "image" : "file",
      };

      if (isImage) {
        const reader = new FileReader();
        reader.onload = e => {
          attachment.preview = e.target?.result as string;
          setAttachments(prev => [...prev]);
        };
        reader.readAsDataURL(file);
      }

      newAttachments.push(attachment);
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    e.target.value = "";
  };

  const removeAttachment = (id: number) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="p-2 sm:p-3 md:p-4">
      <div className="mx-auto max-w-4xl px-1 md:px-0">
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map(attachment => (
              <div
                key={attachment.id}
                className={`group relative flex items-center gap-2 rounded-xl border p-2 backdrop-blur-sm transition-all ${
                  theme === "dark"
                    ? "border-gray-600/50 bg-gray-800/80 hover:border-gray-500/70 hover:bg-gray-700/80"
                    : "border-gray-300/50 bg-white/80 hover:border-gray-400/70 hover:bg-gray-50/80"
                }`}
              >
                {attachment.type === "image" && attachment.preview ? (
                  <div className="relative">
                    <img
                      src={attachment.preview}
                      alt="Preview"
                      className={`h-12 w-12 rounded-lg object-cover ring-2 transition-all group-hover:ring-blue-500/50 sm:h-16 sm:w-16 ${
                        theme === "dark"
                          ? "ring-gray-600/30"
                          : "ring-gray-300/30"
                      }`}
                    />
                    <div className="absolute inset-0 rounded-lg bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  </div>
                ) : (
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg ring-2 sm:h-16 sm:w-16 ${
                      theme === "dark"
                        ? "bg-gray-700/80 ring-gray-600/30"
                        : "bg-gray-200/80 ring-gray-300/30"
                    }`}
                  >
                    <svg
                      className={`h-6 w-6 sm:h-8 sm:w-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
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
                )}
                <div className="max-w-20 sm:max-w-25">
                  <p
                    className={`truncate text-xs font-medium sm:text-sm ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {attachment.file.name}
                  </p>
                  <p
                    className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {formatFileSize(attachment.file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600 sm:-top-2 sm:-right-2 sm:h-6 sm:w-6"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div className="relative">
          {/* Combined Input Container */}
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
              theme === "dark"
                ? "border-gray-800 bg-gray-900"
                : "border-gray-200 bg-white"
            }`}
          >
            {/* Left side buttons */}
            <div className="flex items-center">
              {/* File Attachment Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-lg p-2 ${
                  theme === "dark"
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Text Input */}
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={isListening ? "Listening..." : "Message..."}
              className={`flex-1 bg-transparent text-sm outline-none ${
                theme === "dark"
                  ? "text-white placeholder:text-gray-500"
                  : "text-gray-900 placeholder:text-gray-400"
              }`}
            />

            {/* Right side buttons */}
            <div className="flex items-center gap-1">
              {/* Voice Button */}
              {voiceSupported && (
                <button
                  onClick={toggleVoice}
                  className={`rounded-lg p-2 ${
                    isListening
                      ? "text-red-400"
                      : theme === "dark"
                        ? "text-gray-500 hover:text-gray-300"
                        : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={
                  disabled || (!input.trim() && attachments.length === 0)
                }
                className="rounded-lg bg-emerald-600 p-2 text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    transform="rotate(90 12 12)"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Voice Status */}
        {isListening && (
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-red-400">
            <div className="flex gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-400"></div>
              <div
                className="h-2 w-2 animate-pulse rounded-full bg-red-400"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="h-2 w-2 animate-pulse rounded-full bg-red-400"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="animate-pulse">Listening... Speak now</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageInput;
