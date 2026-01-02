import { useEffect, useRef, useState } from "react";

type MessageInputProps = {
  onSend: (text: string) => void;
  autoFocusTrigger?: number;
};

function MessageInput({ onSend, autoFocusTrigger }: MessageInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [autoFocusTrigger]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="border-t border-gray-700 p-4">
      <div className="max-w-2xl mx-auto flex gap-2 items-center">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Share your thoughts..."
          className="flex-1 bg-gray-800 px-4 py-3 rounded-lg outline-none
          focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 px-4 py-3 rounded-lg hover:bg-blue-500 text-sm md:text-base"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
