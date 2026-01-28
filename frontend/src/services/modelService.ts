const MODEL_API_BASE_URL = "http://localhost:8001";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ReflectRequest {
  message: string;
  context?: ChatMessage[]; // Previous messages for context
  global_context?: string; // Global context string
  user_id?: string; // User ID for fetching global context
}

export interface ReflectResponse {
  response: string;
  debug_info?: {
    context_messages_count: number;
    global_context_length: number;
    has_global_context: boolean;
  };
}

export const modelService = {
  async getReflection(
    message: string,
    context?: ChatMessage[],
    globalContext?: string
  ): Promise<string> {
    try {
      // Filter out empty messages from context
      const cleanContext = context?.filter(msg => msg.content?.trim()) || [];

      // Clean global context
      const cleanGlobalContext = globalContext?.trim() || "";

      console.log("🚀 Calling model API with:", {
        message: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
        contextLength: cleanContext.length,
        globalContextLength: cleanGlobalContext.length,
      });

      const response = await fetch(`${MODEL_API_BASE_URL}/api/v1/reflect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          context: cleanContext,
          global_context: cleanGlobalContext,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Model API error:", response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ReflectResponse = await response.json();

      // Debug log
      if (data.debug_info) {
        console.log("✅ Model response received:", data.debug_info);
      }

      return data.response;
    } catch (error) {
      console.error("Error calling model API:", error);
      // Fallback to a default message if API fails
      return "I'm here to listen. Could you tell me more about what's on your mind?";
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${MODEL_API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error("Model API health check failed:", error);
      return false;
    }
  },
};
