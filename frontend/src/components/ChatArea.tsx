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
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto h-full flex flex-col justify-center text-center text-gray-300 space-y-4">
          <h1 className="text-2xl font-semibold text-white">
            Welcome to Reflectify 🌱
          </h1>
          <p>
            This is a safe space to pause, reflect, and gently understand your thoughts.
          </p>
          <p className="text-sm text-gray-400">
            Start by sharing how you’re feeling today.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-600 ml-auto text-right min-w-fit"
                : "bg-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="bg-gray-700 p-4 rounded-lg w-fit text-sm text-gray-300">
            Reflectify is typing…
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatArea;
