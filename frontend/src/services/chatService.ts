const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  conversationId: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export const chatService = {
  // Create a new conversation
  async createConversation(title?: string): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create conversation: ${response.status}`);
    }

    const data = await response.json();
    return data.conversation;
  },

  // Get all conversations for the current user (titles only, no messages)
  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.status}`);
    }

    const data = await response.json();
    return data.conversations;
  },

  // Get a single conversation by ID
  async getConversation(id: string): Promise<Conversation> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat/conversations/${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.status}`);
    }

    const data = await response.json();
    return data.conversation;
  },

  // Add a single message to a conversation
  async addMessage(
    conversationId: string,
    content: string,
    role: "user" | "assistant"
  ): Promise<Message> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content, role }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add message: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  },

  // Add multiple messages at once (user + assistant pair)
  async addMessages(
    conversationId: string,
    messages: Array<{ content: string; role: "user" | "assistant" }>
  ): Promise<number> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat/conversations/${conversationId}/messages/bulk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ messages }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add messages: ${response.status}`);
    }

    const data = await response.json();
    return data.count;
  },

  // Update conversation title
  async updateConversation(id: string, title: string): Promise<Conversation> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat/conversations/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update conversation: ${response.status}`);
    }

    const data = await response.json();
    return data.conversation;
  },

  // Delete a conversation
  async deleteConversation(id: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/chat/conversations/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete conversation: ${response.status}`);
    }
  },

  // Delete all conversations
  async deleteAllConversations(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/chat/conversations`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete conversations: ${response.status}`);
    }
  },
};
