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
    <div className="border-t border-gray-700 p-3 md:p-4">
      <div className="mx-auto flex max-w-2xl items-center gap-2 px-1 md:px-0">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Share your thoughts..."
          className="flex-1 rounded-lg bg-gray-800 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="rounded-lg bg-blue-600 px-4 py-3 text-sm hover:bg-blue-500 md:text-base"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
