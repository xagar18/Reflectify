const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

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

    // Filter only active items
    const activeItems = contextItems.filter(item => item.isActive);

    if (activeItems.length === 0) {
      return "";
    }

    // Group by category
    const contextByCategory: { [key: string]: string[] } = {};

    activeItems.forEach(item => {
      const category = item.category || "general";
      if (!contextByCategory[category]) {
        contextByCategory[category] = [];
      }
      // Use clearer formatting
      contextByCategory[category].push(`${item.key}: ${item.value}`);
    });

    // Format as readable text with clear structure
    const lines: string[] = [];

    // Order categories: personal first, then others
    const categoryOrder = [
      "personal",
      "professional",
      "preferences",
      "health",
      "general",
      "other",
    ];
    const sortedCategories = Object.keys(contextByCategory).sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.toLowerCase());
      const bIndex = categoryOrder.indexOf(b.toLowerCase());
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    sortedCategories.forEach(category => {
      lines.push(`[${category.toUpperCase()}]`);
      contextByCategory[category].forEach(item => {
        lines.push(`• ${item}`);
      });
    });

    return lines.join("\n");
  },
};
