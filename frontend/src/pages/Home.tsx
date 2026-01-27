import { PanelRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Message } from "../components/ChatArea";
import ChatArea from "../components/ChatArea";
import MessageInput, { type AttachedFile } from "../components/MessageInput";
import Settings from "../components/Settings";
import Sidebar from "../components/Sidebar";
import { chatService, type Conversation } from "../services/chatService";
import { modelService } from "../services/modelService";
import useStore from "../zustand/store";

/* ================= TYPES ================= */

type Chat = {
  id: string; // Changed to string to match database IDs
  title: string;
  messages: Message[];
  dbId?: string; // Database ID for syncing
  messagesLoaded?: boolean; // Track if messages have been loaded from DB
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

// Convert database conversation to local Chat format
function dbConversationToChat(conv: Conversation): Chat {
  return {
    id: conv.id,
    title: conv.title,
    dbId: conv.id,
    messagesLoaded: conv.messages.length > 0, // Mark if messages came with the conversation
    messages: conv.messages.map((msg, index) => ({
      id: index,
      text: msg.content,
      sender: msg.role === "user" ? "user" : "bot",
      timestamp: new Date(msg.createdAt),
    })),
  };
}

// Reflectify’s emotional logic - now handled by AI model
// function getBotReply(userText: string): string {
//   const text = userText.toLowerCase();

//   if (text.includes("stress") || text.includes("overwhelmed")) {
//     return "It sounds like things feel heavy right now. Let’s slow down together 🌿";
//   }

//   if (text.includes("sad") || text.includes("lonely")) {
//     return "I’m really glad you shared this. You’re not alone here 💙";
//   }

//   if (text.includes("happy") || text.includes("grateful")) {
//     return "That’s lovely to hear ✨ Want to share more?";
//   }

//   return "Thank you for opening up. Would you like to explore this feeling a bit more?";
// }

/* ================= APP ================= */

function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [typingChatId, setTypingChatId] = useState<string | null>(null); // Track which chat is typing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // Loading state for messages
  const { theme, isAuthenticated, privacySettings } = useStore();

  // 🔑 used ONLY to force input focus
  const [focusInputKey, setFocusInputKey] = useState(0);

  // Load chats from database or localStorage
  const loadChats = useCallback(async () => {
    setIsLoading(true);

    if (isAuthenticated && privacySettings.saveHistory) {
      // Load from database (titles only, messages loaded on demand)
      try {
        const conversations = await chatService.getConversations();
        const loadedChats = conversations.map(dbConversationToChat);
        setChats(loadedChats);

        // Set active chat to the most recent one and load its messages
        if (loadedChats.length > 0 && !activeChatId) {
          const firstChatId = loadedChats[0].id;
          setActiveChatId(firstChatId);
          // Load messages for the first chat
          if (!loadedChats[0].messagesLoaded) {
            try {
              const conversation =
                await chatService.getConversation(firstChatId);
              setChats(prev =>
                prev.map(c => {
                  if (c.id !== firstChatId) return c;
                  return {
                    ...c,
                    messagesLoaded: true,
                    messages: conversation.messages.map((msg, index) => ({
                      id: index,
                      text: msg.content,
                      sender: msg.role === "user" ? "user" : ("bot" as const),
                      timestamp: new Date(msg.createdAt),
                    })),
                  };
                })
              );
            } catch (error) {
              console.error("Error loading first chat messages:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error loading chats from database:", error);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } else {
      // Load from localStorage for non-authenticated users
      loadFromLocalStorage();
    }

    setIsLoading(false);
  }, [isAuthenticated, privacySettings.saveHistory]);

  const loadFromLocalStorage = () => {
    const savedChats = localStorage.getItem("reflectify-chats");
    const savedActiveChatId = localStorage.getItem("reflectify-active-chat-id");

    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        const chatsWithDates = parsedChats.map((chat: any) => ({
          ...chat,
          id: String(chat.id), // Ensure ID is string
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined,
          })),
        }));
        setChats(chatsWithDates);
      } catch (error) {
        console.error("Error loading chats from localStorage:", error);
      }
    }

    if (savedActiveChatId) {
      setActiveChatId(savedActiveChatId);
    }
  };

  // Load chats on mount and when auth state changes
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("reflectify-chats", JSON.stringify(chats));
    }
  }, [chats]);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedSidebarState = localStorage.getItem("reflectify-sidebar-open");
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "reflectify-sidebar-open",
      JSON.stringify(isSidebarOpen)
    );
  }, [isSidebarOpen]);

  // Load messages when switching to a conversation that hasn't been loaded yet
  const loadMessagesForChat = useCallback(
    async (chatId: string) => {
      const chat = chats.find(c => c.id === chatId);
      if (!chat || chat.messagesLoaded || !chat.dbId) return;

      if (isAuthenticated && privacySettings.saveHistory) {
        setIsLoadingMessages(true);
        try {
          const conversation = await chatService.getConversation(chatId);
          setChats(prev =>
            prev.map(c => {
              if (c.id !== chatId) return c;
              return {
                ...c,
                messagesLoaded: true,
                messages: conversation.messages.map((msg, index) => ({
                  id: index,
                  text: msg.content,
                  sender: msg.role === "user" ? "user" : ("bot" as const),
                  timestamp: new Date(msg.createdAt),
                })),
              };
            })
          );
        } catch (error) {
          console.error("Error loading messages:", error);
        } finally {
          setIsLoadingMessages(false);
        }
      }
    },
    [chats, isAuthenticated, privacySettings.saveHistory]
  );

  // Handle chat selection with lazy loading
  const handleSelectChat = useCallback(
    (chatId: string) => {
      setActiveChatId(chatId);
      loadMessagesForChat(chatId);
    },
    [loadMessagesForChat]
  );

  /* ========== NEW CHAT (ChatGPT BEHAVIOR) ========== */
  const createNewChat = async () => {
    // If an empty chat already exists → reuse it
    const emptyChat = chats.find(chat => chat.messages.length === 0);

    if (emptyChat) {
      setActiveChatId(emptyChat.id);
    } else {
      // Create in database if authenticated
      if (isAuthenticated && privacySettings.saveHistory) {
        try {
          const conversation = await chatService.createConversation();
          const newChat: Chat = {
            id: conversation.id,
            title: "New Reflection",
            messages: [],
            dbId: conversation.id,
          };
          setChats(prev => [newChat, ...prev]);
          setActiveChatId(newChat.id);
        } catch (error) {
          console.error("Error creating conversation:", error);
          // Fallback to local-only chat
          const newChat: Chat = {
            id: String(Date.now()),
            title: "New Reflection",
            messages: [],
          };
          setChats(prev => [newChat, ...prev]);
          setActiveChatId(newChat.id);
        }
      } else {
        const newChat: Chat = {
          id: String(Date.now()),
          title: "New Reflection",
          messages: [],
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
      }
    }

    // auto-focus input
    setFocusInputKey(prev => prev + 1);
  };

  /* ========== SEND MESSAGE ========== */
  const handleSend = async (text: string, attachments?: AttachedFile[]) => {
    let currentActiveChatId = activeChatId;
    let currentChat = chats.find(c => c.id === currentActiveChatId);

    // If no active chat, create one
    if (!currentActiveChatId) {
      if (isAuthenticated && privacySettings.saveHistory) {
        try {
          const conversation = await chatService.createConversation();
          const newChat: Chat = {
            id: conversation.id,
            title: "New Reflection",
            messages: [],
            dbId: conversation.id,
          };
          setChats(prev => [newChat, ...prev]);
          setActiveChatId(newChat.id);
          currentActiveChatId = newChat.id;
          currentChat = newChat;
        } catch (error) {
          console.error("Error creating conversation:", error);
          const newChat: Chat = {
            id: String(Date.now()),
            title: "New Reflection",
            messages: [],
          };
          setChats(prev => [newChat, ...prev]);
          setActiveChatId(newChat.id);
          currentActiveChatId = newChat.id;
          currentChat = newChat;
        }
      } else {
        const newChat: Chat = {
          id: String(Date.now()),
          title: "New Reflection",
          messages: [],
        };
        setChats(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        currentActiveChatId = newChat.id;
        currentChat = newChat;
      }
    }

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user",
      attachments,
      timestamp: new Date(),
    };

    setChats(prev =>
      prev.map(chat => {
        if (chat.id !== currentActiveChatId) return chat;

        const isFirstMessage = chat.messages.length === 0;

        return {
          ...chat,
          title: isFirstMessage
            ? generateChatTitle(text || "Shared file")
            : chat.title,
          messages: [...chat.messages, userMessage],
        };
      })
    );

    // Start typing indicator after user message is sent
    setTimeout(() => {
      setTypingChatId(currentActiveChatId);

      setTimeout(async () => {
        // Generate contextual reply based on attachments
        let replyText = await modelService.getReflection(text);
        if (attachments && attachments.length > 0) {
          const imageCount = attachments.filter(a => a.type === "image").length;
          const fileCount = attachments.length - imageCount;

          if (imageCount > 0 && text) {
            replyText = `Thank you for sharing that image with your thoughts. ${replyText}`;
          } else if (imageCount > 0) {
            replyText =
              "Thank you for sharing this image. Images can often express feelings that words cannot. What does this image represent to you? 🎨";
          } else if (fileCount > 0) {
            replyText = `I've received your file${fileCount > 1 ? "s" : ""}. Thank you for trusting me with this. Is there anything specific about ${fileCount > 1 ? "them" : "it"} you'd like to discuss? 📎`;
          }
        }

        const botMessage: Message = {
          id: Date.now() + 1,
          text: replyText,
          sender: "bot",
          timestamp: new Date(),
        };

        setChats(prev =>
          prev.map(chat => {
            if (chat.id !== currentActiveChatId) return chat;
            return {
              ...chat,
              messages: [...chat.messages, botMessage],
            };
          })
        );

        // Save messages to database if authenticated
        if (
          isAuthenticated &&
          privacySettings.saveHistory &&
          currentActiveChatId
        ) {
          try {
            await chatService.addMessages(currentActiveChatId, [
              { content: text, role: "user" },
              { content: replyText, role: "assistant" },
            ]);
          } catch (error) {
            console.error("Error saving messages to database:", error);
          }
        }

        setTypingChatId(null);
      }, 1200);
    }, 300);
  };

  /* ========== RENAME CHAT ========== */
  const renameChat = async (id: string, title: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === id
          ? { ...chat, title: title || "Untitled Reflection" }
          : chat
      )
    );

    // Update in database if authenticated
    if (isAuthenticated && privacySettings.saveHistory) {
      try {
        await chatService.updateConversation(
          id,
          title || "Untitled Reflection"
        );
      } catch (error) {
        console.error("Error updating conversation title:", error);
      }
    }
  };

  /* ========== DELETE CHAT ========== */
  const deleteChat = async (id: string) => {
    // Delete from database if authenticated
    if (isAuthenticated && privacySettings.saveHistory) {
      try {
        await chatService.deleteConversation(id);
      } catch (error) {
        console.error("Error deleting conversation:", error);
      }
    }

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

  return (
    <div
      className={`flex h-screen w-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-linear-to-b from-gray-900 to-black text-white"
          : "bg-linear-to-b from-gray-50 to-white text-gray-900"
      }`}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={createNewChat}
        onSelectChat={handleSelectChat}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
      />

      <main className="relative flex min-w-0 flex-1 flex-col">
        {/* Header with logo, Reflectify text, and hamburger */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-3 sm:top-4 sm:left-4">
          {/* Hamburger button - hidden on desktop when sidebar is open */}
          <div className={`group relative ${isSidebarOpen ? "md:hidden" : ""}`}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`flex h-8 w-8 items-center justify-center rounded-md sm:h-9 sm:w-9 ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-600 shadow-md hover:bg-gray-100"
              }`}
            >
              <PanelRight />
            </button>
            <div
              className={`absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 ${
                theme === "dark"
                  ? "bg-black text-white"
                  : "bg-gray-800 text-white"
              }`}
            >
              Open sidebar
            </div>
          </div>
          {/* Logo + Reflectify text - always visible */}
          <div className="flex items-center gap-2">
            <span className="text-lg"></span>
            <span
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Reflectify
            </span>
          </div>
        </div>

        <ChatArea
          messages={activeMessages}
          isTyping={typingChatId === activeChatId}
          isLoadingMessages={isLoadingMessages}
        />

        <MessageInput onSend={handleSend} autoFocusTrigger={focusInputKey} />
      </main>

      {/* Settings Modal */}
      <Settings />
    </div>
  );
}

export default Home;
