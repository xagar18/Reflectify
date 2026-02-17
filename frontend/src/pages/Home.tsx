import { PanelRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { Message } from "../components/ChatArea";
import ChatArea from "../components/ChatArea";
import GuestLimitBanner from "../components/GuestLimitBanner";
import MessageInput, { type AttachedFile } from "../components/MessageInput";
import Settings from "../components/Settings";
import Sidebar from "../components/Sidebar";
import { chatService, type Conversation } from "../services/chatService";
import {
  globalContextService,
  type GlobalContextItem,
} from "../services/globalContextService";
import { guestRateLimitService } from "../services/guestRateLimitService";
import { modelService, type ChatMessage } from "../services/modelService";
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
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [typingChatId, setTypingChatId] = useState<string | null>(null); // Track which chat is typing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // Loading state for messages
  const [globalContext, setGlobalContext] = useState<GlobalContextItem[]>([]);
  const [isLoadingGlobalContext, setIsLoadingGlobalContext] = useState(false);
  const [guestLimitReached, setGuestLimitReached] = useState(false);
  const [guestStatsRefresh, setGuestStatsRefresh] = useState(0);
  const {
    theme,
    isAuthenticated,
    privacySettings,
    userData,
    globalContextVersion,
  } = useStore();

  // Voice conversation state
  const [isVoiceConversation, setIsVoiceConversation] = useState(false);
  const [triggerListening, setTriggerListening] = useState(0);
  const isVoiceConversationRef = useRef(false);

  // Navigation handler for guest login prompt
  const handleLoginClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  // Keep voice conversation ref in sync
  useEffect(() => {
    isVoiceConversationRef.current = isVoiceConversation;
  }, [isVoiceConversation]);

  // Check guest rate limit on mount and when stats refresh
  useEffect(() => {
    if (!isAuthenticated) {
      setGuestLimitReached(!guestRateLimitService.canSendMessage());
    } else {
      setGuestLimitReached(false);
    }
  }, [isAuthenticated, guestStatsRefresh]);

  // used ONLY to force input focus
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
          messages:
            chat.messages?.map((msg: any) => ({
              ...msg,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined,
            })) || [],
        }));
        setChats(chatsWithDates);

        // Set active chat - validate it exists in loaded chats
        if (
          savedActiveChatId &&
          chatsWithDates.some((c: any) => c.id === savedActiveChatId)
        ) {
          setActiveChatId(savedActiveChatId);
        } else if (chatsWithDates.length > 0) {
          // Fallback to first chat if saved active chat doesn't exist
          setActiveChatId(chatsWithDates[0].id);
        }
      } catch (error) {
        console.error("Error loading chats from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("reflectify-chats");
        localStorage.removeItem("reflectify-active-chat-id");
      }
    } else if (savedActiveChatId) {
      // No chats but have an active ID - clear it
      localStorage.removeItem("reflectify-active-chat-id");
    }
  };

  // Load global context
  const loadGlobalContext = useCallback(async () => {
    if (isAuthenticated) {
      setIsLoadingGlobalContext(true);
      try {
        const contextItems = await globalContextService.getGlobalContext();
        setGlobalContext(contextItems);
      } catch (error) {
        console.error("Error loading global context:", error);
      } finally {
        setIsLoadingGlobalContext(false);
      }
    }
  }, [isAuthenticated]);

  // Load chats on mount and when auth state changes
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Load global context on mount, when auth changes, or when globalContextVersion changes
  useEffect(() => {
    loadGlobalContext();
  }, [loadGlobalContext, globalContextVersion]);

  // Save chats to localStorage whenever chats change (only for non-authenticated users or when saveHistory is disabled)
  useEffect(() => {
    // Only save to localStorage for non-authenticated users or when saveHistory is disabled
    if (!isAuthenticated || !privacySettings.saveHistory) {
      if (chats.length > 0) {
        localStorage.setItem("reflectify-chats", JSON.stringify(chats));
      }
    }
  }, [chats, isAuthenticated, privacySettings.saveHistory]);

  // Save active chat ID to localStorage
  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem("reflectify-active-chat-id", activeChatId);
    }
  }, [activeChatId]);

  // Clear localStorage chats when user logs in with saveHistory enabled (using database instead)
  useEffect(() => {
    if (isAuthenticated && privacySettings.saveHistory) {
      // User is authenticated and saving to DB, clear local storage chats to avoid conflicts
      localStorage.removeItem("reflectify-chats");
    }
  }, [isAuthenticated, privacySettings.saveHistory]);

  // Clear chats when user logs out (isAuthenticated becomes false)
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear chats state so welcome screen appears
      setChats([]);
      setActiveChatId(null);
    }
  }, [isAuthenticated]);

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
    // Check guest rate limit for non-authenticated users
    if (!isAuthenticated) {
      if (!guestRateLimitService.canSendMessage()) {
        setGuestLimitReached(true);
        setGuestStatsRefresh(prev => prev + 1);
        return;
      }
      // Record the message for guest rate limiting
      guestRateLimitService.recordMessage();
      setGuestStatsRefresh(prev => prev + 1);
    }

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

    // Start typing indicator immediately and get AI response
    setTypingChatId(currentActiveChatId);

    // Get AI response (no artificial delays)
    (async () => {
      // Build context from previous messages (model will limit if needed)
      const currentChatState = chats.find(c => c.id === currentActiveChatId);
      const contextMessages: ChatMessage[] = [];

      if (currentChatState) {
        // Send last 10 messages as context - model will trim if configured to use less
        const recentMessages = currentChatState.messages.slice(-10);

        for (const msg of recentMessages) {
          contextMessages.push({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          });
        }
      }

      // Fetch fresh global context before generating reply to ensure latest data
      let currentGlobalContext = globalContext;
      if (isAuthenticated) {
        try {
          currentGlobalContext = await globalContextService.getGlobalContext();
          setGlobalContext(currentGlobalContext); // Update state with fresh data
        } catch (error) {
          console.error("Error fetching fresh global context:", error);
          // Fall back to cached context
        }
      }

      // Generate contextual reply based on attachments
      const formattedGlobalContext =
        globalContextService.formatGlobalContextForAI(currentGlobalContext);

      // Debug log (remove in production)
      console.log(
        "📋 Sending global context to model:",
        formattedGlobalContext
          ? `${formattedGlobalContext.length} chars`
          : "none"
      );

      let replyText = await modelService.getReflection(
        text,
        contextMessages,
        formattedGlobalContext
      );
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

      // Voice conversation: read reply aloud, then restart listening
      if (isVoiceConversationRef.current) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(replyText);
        utterance.onend = () => {
          setTriggerListening(prev => prev + 1);
        };
        window.speechSynthesis.speak(utterance);
      }

      setTypingChatId(null);
    })();
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

  // Check if we should show the welcome screen (no chats exist)
  const showWelcomeScreen = chats.length === 0 && !isLoading;

  return (
    <div
      className={`flex h-screen w-screen ${
        theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Only show sidebar when there are chats */}
      {chats.length > 0 && (
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
      )}

      <main className="relative flex min-w-0 flex-1 flex-col pt-16">
        {/* Header */}
        <div
          className={`fixed top-0 right-0 z-20 flex items-center justify-between px-4 py-3 ${isSidebarOpen && chats.length > 0 ? "left-64" : "left-0"} ${theme === "dark" ? "bg-gray-950" : "bg-gray-50"}`}
        >
          <div className="flex items-center gap-3">
            {chats.length > 0 && !isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`rounded-lg p-2 ${
                  theme === "dark"
                    ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
              >
                <PanelRight className="h-5 w-5" />
              </button>
            )}
            {/* Show Reflectify title when there are chats */}
            {chats.length > 0 && (
              <span
                className={`font-semibold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
              >
                Reflectify
              </span>
            )}
          </div>

          {/* Auth buttons for guests */}
          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/register")}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Sign up
              </button>
            </div>
          )}
        </div>

        {/* Welcome Screen - shown when no chats exist */}
        {showWelcomeScreen ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <div className="max-w-md text-center">
              <h1
                className={`mb-3 text-2xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome to Reflectify 🌿
              </h1>
              <p
                className={`mb-8 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                A calm space for self-reflection and mindful conversations.
              </p>
              <button
                onClick={createNewChat}
                className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-500"
              >
                Start a new reflection
              </button>
              {!isAuthenticated && (
                <p
                  className={`mt-6 text-sm ${
                    theme === "dark" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {/* 7 reflections available as a guest */}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Guest Rate Limit Banner */}
            {!isAuthenticated && (
              <div className="px-4 pt-4">
                <GuestLimitBanner
                  theme={theme}
                  onLoginClick={handleLoginClick}
                  refreshKey={guestStatsRefresh}
                />
              </div>
            )}

            <ChatArea
              messages={activeMessages}
              isTyping={typingChatId === activeChatId}
              isLoadingMessages={isLoadingMessages}
            />

            <MessageInput
              onSend={handleSend}
              autoFocusTrigger={focusInputKey}
              disabled={
                typingChatId === activeChatId ||
                (!isAuthenticated && guestLimitReached)
              }
              isVoiceConversation={isVoiceConversation}
              onVoiceConversationToggle={() => {
                const newState = !isVoiceConversation;
                if (!newState) window.speechSynthesis.cancel();
                setIsVoiceConversation(newState);
              }}
              triggerListening={triggerListening}
            />
          </>
        )}
      </main>

      {/* Settings Modal */}
      <Settings />
    </div>
  );
}

export default Home;
