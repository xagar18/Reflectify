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
}

export const modelService = {
  async getReflection(
    message: string,
    context?: ChatMessage[],
    globalContext?: string
  ): Promise<string> {
    try {
      const response = await fetch(`${MODEL_API_BASE_URL}/api/v1/reflect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          context: context || [],
          global_context: globalContext || ""
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ReflectResponse = await response.json();
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
