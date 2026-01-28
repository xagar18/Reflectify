const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface GlobalContextItem {
  id: string;
  key: string;
  value: string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const globalContextService = {
  // Get all global context items for the current user
  async getGlobalContext(): Promise<GlobalContextItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/global-context`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch global context: ${response.status}`);
    }

    const data = await response.json();
    return data.globalContexts;
  },

  // Add or update a global context item
  async setGlobalContext(
    key: string,
    value: string,
    category?: string
  ): Promise<GlobalContextItem> {
    const response = await fetch(`${API_BASE_URL}/api/v1/global-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ key, value, category }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set global context: ${response.status}`);
    }

    const data = await response.json();
    return data.globalContext;
  },

  // Delete a global context item
  async deleteGlobalContext(key: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/global-context/${key}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete global context: ${response.status}`);
    }
  },

  // Format global context for AI consumption
  formatGlobalContextForAI(contextItems: GlobalContextItem[]): string {
    if (!contextItems || contextItems.length === 0) {
      return "";
    }

    // Group by category
    const contextByCategory: { [key: string]: string[] } = {};

    contextItems.forEach((item) => {
      const category = item.category || "general";
      if (!contextByCategory[category]) {
        contextByCategory[category] = [];
      }
      contextByCategory[category].push(`${item.key}: ${item.value}`);
    });

    // Format as readable text
    let formattedContext = "";
    Object.keys(contextByCategory).forEach((category) => {
      formattedContext += `${category.toUpperCase()}:\n`;
      contextByCategory[category].forEach((item) => {
        formattedContext += `- ${item}\n`;
      });
      formattedContext += "\n";
    });

    return formattedContext.trim();
  },
};