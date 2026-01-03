type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

type ChatAreaProps = {
  messages: Message[];
  isTyping: boolean;
};

function ChatArea({ messages, isTyping }: ChatAreaProps) {
  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto flex h-full max-w-2xl flex-col justify-center space-y-4 px-4 text-center text-gray-300 md:px-0">
          <h1 className="text-2xl font-semibold text-white">
            Welcome to Reflectify 🌱
          </h1>
          <p>
            This is a safe space to pause, reflect, and gently understand your
            thoughts.
          </p>
          <p className="text-sm text-gray-400">
            Start by sharing how you’re feeling today.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-2xl space-y-4 pt-12 md:pt-0">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[80%] rounded-lg p-4 ${
              msg.sender === "user"
                ? "ml-auto min-w-fit bg-blue-600 text-right"
                : "bg-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="w-fit rounded-lg bg-gray-700 p-4 text-sm text-gray-300">
            Reflectify is typing…
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatArea;
