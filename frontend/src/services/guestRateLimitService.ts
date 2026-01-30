// Guest Rate Limit Service
// Tracks message usage for non-authenticated users
// Allows 7 messages every 6 hours

const STORAGE_KEY = "reflectify-guest-usage";
const MAX_MESSAGES = 7;
const TIME_WINDOW_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

interface GuestUsage {
  messages: number[]; // Array of timestamps when messages were sent
}

const getUsage = (): GuestUsage => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading guest usage from localStorage:", error);
  }
  return { messages: [] };
};

const saveUsage = (usage: GuestUsage): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch (error) {
    console.error("Error saving guest usage to localStorage:", error);
  }
};

// Clean up old messages outside the time window
const cleanupOldMessages = (usage: GuestUsage): GuestUsage => {
  const now = Date.now();
  const validMessages = usage.messages.filter(
    timestamp => now - timestamp < TIME_WINDOW_MS
  );
  return { messages: validMessages };
};

export const guestRateLimitService = {
  // Check if guest can send a message
  canSendMessage(): boolean {
    const usage = cleanupOldMessages(getUsage());
    saveUsage(usage);
    return usage.messages.length < MAX_MESSAGES;
  },

  // Record a message being sent
  recordMessage(): void {
    const usage = cleanupOldMessages(getUsage());
    usage.messages.push(Date.now());
    saveUsage(usage);
  },

  // Get remaining messages count
  getRemainingMessages(): number {
    const usage = cleanupOldMessages(getUsage());
    saveUsage(usage);
    return Math.max(0, MAX_MESSAGES - usage.messages.length);
  },

  // Get time until next message is available (in milliseconds)
  getTimeUntilReset(): number | null {
    const usage = cleanupOldMessages(getUsage());
    if (usage.messages.length === 0) return null;

    // Find the oldest message timestamp
    const oldestMessage = Math.min(...usage.messages);
    const resetTime = oldestMessage + TIME_WINDOW_MS;
    const timeUntilReset = resetTime - Date.now();

    return timeUntilReset > 0 ? timeUntilReset : null;
  },

  // Format time until reset as human-readable string
  getFormattedTimeUntilReset(): string | null {
    const timeMs = this.getTimeUntilReset();
    if (timeMs === null) return null;

    const hours = Math.floor(timeMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },

  // Get usage stats for display
  getUsageStats(): {
    remaining: number;
    total: number;
    timeUntilReset: string | null;
    isLimitReached: boolean;
    isRunningLow: boolean;
  } {
    const remaining = this.getRemainingMessages();
    return {
      remaining,
      total: MAX_MESSAGES,
      timeUntilReset: this.getFormattedTimeUntilReset(),
      isLimitReached: remaining === 0,
      isRunningLow: remaining > 0 && remaining <= 2,
    };
  },

  // Clear usage (for testing or when user logs in)
  clearUsage(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default guestRateLimitService;
