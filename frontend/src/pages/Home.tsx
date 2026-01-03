import { useState } from "react";
import ChatArea from "../components/ChatArea";
import MessageInput from "../components/MessageInput";
import Sidebar from "../components/Sidebar";

/* ================= TYPES ================= */

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

/* ================= HELPERS ================= */

function generateChatTitle(text: string): string {
  const cleaned = text
    .replace(/[^\w\s]/gi, "")
    .trim()
    .split(" ")
    .slice(0, 5)
    .join(" ");

  return cleaned
    ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    : "New Reflection";
}

// Reflectify’s emotional logic
function getBotReply(userText: string): string {
  const text = userText.toLowerCase();

  if (text.includes("stress") || text.includes("overwhelmed")) {
    return "It sounds like things feel heavy right now. Let’s slow down together 🌿";
  }

  if (text.includes("sad") || text.includes("lonely")) {
    return "I’m really glad you shared this. You’re not alone here 💙";
  }

  if (text.includes("happy") || text.includes("grateful")) {
    return "That’s lovely to hear ✨ Want to share more?";
  }

  return "Thank you for opening up. Would you like to explore this feeling a bit more?";
}

/* ================= APP ================= */

function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 🔑 used ONLY to force input focus
  const [focusInputKey, setFocusInputKey] = useState(0);

  /* ========== NEW CHAT (ChatGPT BEHAVIOR) ========== */
  const createNewChat = () => {
    // If an empty chat already exists → reuse it
    const emptyChat = chats.find(chat => chat.messages.length === 0);

    if (emptyChat) {
      setActiveChatId(emptyChat.id);
    } else {
      const newChat: Chat = {
        id: Date.now(),
        title: "New Reflection",
        messages: [],
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }

    // auto-focus input
    setFocusInputKey(prev => prev + 1);
  };

  /* ========== SEND MESSAGE ========== */
  const handleSend = (text: string) => {
    if (!activeChatId) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user",
    };

    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getBotReply(text),
        sender: "bot",
      };

      setChats(prev =>
        prev.map(chat => {
          if (chat.id !== activeChatId) return chat;

          const isFirstMessage = chat.messages.length === 0;

          return {
            ...chat,
            title: isFirstMessage ? generateChatTitle(text) : chat.title,
            messages: [...chat.messages, userMessage, botMessage],
          };
        })
      );

      setIsTyping(false);
    }, 1200);
  };

  /* ========== RENAME CHAT ========== */
  const renameChat = (id: number, title: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === id
          ? { ...chat, title: title || "Untitled Reflection" }
          : chat
      )
    );
  };

  /* ========== DELETE CHAT ========== */
  const deleteChat = (id: number) => {
    setChats(prev => {
      const updated = prev.filter(chat => chat.id !== id);
      if (id === activeChatId) {
        setActiveChatId(updated.length ? updated[0].id : null);
      }
      return updated;
    });
  };

  const activeMessages =
    chats.find(chat => chat.id === activeChatId)?.messages || [];

  /* ================= UI ================= */

  return (
    <div className="flex h-screen w-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createNewChat}
        onSelectChat={setActiveChatId}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
      />

      <main className="relative flex flex-1 flex-col">
        {/* OPEN SIDEBAR BUTTON - Always visible on mobile, hidden on desktop when sidebar open */}
        <div
          className={`group absolute top-4 left-4 z-20 ${isSidebarOpen ? "md:hidden" : ""}`}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            ☰
          </button>
          <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100">
            Open sidebar
          </div>
        </div>

        <ChatArea messages={activeMessages} isTyping={isTyping} />

        <MessageInput onSend={handleSend} autoFocusTrigger={focusInputKey} />
      </main>
    </div>
  );
}

export default Home;
