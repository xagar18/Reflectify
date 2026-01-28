import axios from "axios";
import { create } from "zustand";
import { globalContextService } from "../services/globalContextService";

// Theme type - now includes system option
export type ThemeOption = "dark" | "light" | "system";
export type Theme = "dark" | "light"; // Actual applied theme

// Language options
export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "zh"
  | "ja"
  | "ar"
  | "hi"
  | "pt"
  | "ru";

// Privacy settings
export interface PrivacySettings {
  saveHistory: boolean;
  shareAnalytics: boolean;
  showOnlineStatus: boolean;
}

// Interface defining the structure of the authentication state
interface AuthState {
  userData: any | null; // Stores user data or null if not authenticated
  isAuthenticated: boolean; // Boolean flag for authentication status
  themeOption: ThemeOption; // User's theme preference (dark/light/system)
  theme: Theme; // Current applied theme
  language: Language; // Current language
  privacySettings: PrivacySettings; // Privacy settings
  isSettingsOpen: boolean; // Settings modal state
  globalContextVersion: number; // Version counter to trigger global context refresh
  // Function to set user data and mark as authenticated
  auth: (data: any) => Promise<void>; // Function to set user data and mark as authenticated
  logout: () => void; // Function to log out user by clearing data and authentication flag
  getProfile: () => Promise<void>; // Function to fetch user profile from backend
  toggleTheme: () => void; // Function to toggle between dark and light theme
  setThemeOption: (option: ThemeOption) => void; // Function to set theme option
  setLanguage: (language: Language) => void; // Function to set language
  setPrivacySettings: (settings: Partial<PrivacySettings>) => void; // Function to update privacy settings
  openSettings: () => void; // Function to open settings modal
  closeSettings: () => void; // Function to close settings modal
  refreshGlobalContext: () => void; // Function to trigger global context refresh
}

// Get system theme preference
const getSystemTheme = (): Theme => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "dark";
};

// Get initial theme option from localStorage or default to system
const getInitialThemeOption = (): ThemeOption => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("reflectify-theme-option");
    // Validate saved value
    if (saved && ["dark", "light", "system"].includes(saved)) {
      return saved as ThemeOption;
    }
  }
  return "system";
};

// Get applied theme based on theme option
const getAppliedTheme = (option: ThemeOption): Theme => {
  if (option === "system") return getSystemTheme();
  return option;
};

// Get initial language from localStorage
const getInitialLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("reflectify-language");
    const validLanguages = [
      "en",
      "es",
      "fr",
      "de",
      "zh",
      "ja",
      "ar",
      "hi",
      "pt",
      "ru",
    ];
    if (saved && validLanguages.includes(saved)) {
      return saved as Language;
    }
  }
  return "en";
};

// Get initial privacy settings from localStorage
const getInitialPrivacySettings = (): PrivacySettings => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("reflectify-privacy");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
  }
  return {
    saveHistory: true,
    shareAnalytics: false,
    showOnlineStatus: true,
  };
};

// Create Zustand store for managing authentication state
const useStore = create<AuthState>(set => ({
  userData: null, // Initial state: no user data
  isAuthenticated: false, // Initial state: not authenticated
  themeOption: getInitialThemeOption(), // User's theme preference
  theme: getAppliedTheme(getInitialThemeOption()), // Initial applied theme
  language: getInitialLanguage(), // Initial language
  privacySettings: getInitialPrivacySettings(), // Initial privacy settings
  isSettingsOpen: false, // Settings modal initially closed
  globalContextVersion: 0, // Initial version for global context refresh trigger
  // Function to authenticate user by setting user data and authentication flag
  auth: async data => {
    set({ userData: data, isAuthenticated: true });

    // Automatically add user's name to global context if available
    if (data.name) {
      try {
        await globalContextService.setGlobalContext(
          "name",
          data.name,
          "personal"
        );
      } catch (error) {
        console.error("Error adding user name to global context:", error);
        // Don't fail authentication if this fails
      }
    }
  },
  // Async function to fetch user profile from backend and update state
  getProfile: async () => {
    // Make GET request to backend profile endpoint
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile`,
      { withCredentials: true } // Include cookies for authentication
    );

    // Update state with fetched user data and set authenticated to true
    set({ userData: response.data.user, isAuthenticated: true });

    // Automatically add user's name to global context if available
    if (response.data.user.name) {
      try {
        await globalContextService.setGlobalContext(
          "name",
          response.data.user.name,
          "personal"
        );
      } catch (error) {
        console.error("Error adding user name to global context:", error);
        // Don't fail the profile loading if this fails
      }
    }

    // Debug log for user data (consider removing in production)
    console.log(response.data.user);
  },
  // Function to log out user by clearing user data and authentication flag
  logout: async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
      {},
      { withCredentials: true } // Include cookies for authentication
    );

    // Clear user data and set authenticated to false
    set({ userData: null, isAuthenticated: false });

    // Debug log for logout response (consider removing in production)
    console.log(response.data);
  },
  // Function to toggle between dark and light theme
  toggleTheme: () =>
    set(state => {
      const newOption: ThemeOption =
        state.themeOption === "dark" ? "light" : "dark";
      localStorage.setItem("reflectify-theme-option", newOption);
      return { themeOption: newOption, theme: getAppliedTheme(newOption) };
    }),
  // Function to set theme option (dark/light/system)
  setThemeOption: (option: ThemeOption) => {
    localStorage.setItem("reflectify-theme-option", option);
    set({ themeOption: option, theme: getAppliedTheme(option) });
  },
  // Function to set language
  setLanguage: (language: Language) => {
    localStorage.setItem("reflectify-language", language);
    set({ language });
  },
  // Function to update privacy settings
  setPrivacySettings: (settings: Partial<PrivacySettings>) =>
    set(state => {
      const newSettings = { ...state.privacySettings, ...settings };
      localStorage.setItem("reflectify-privacy", JSON.stringify(newSettings));
      return { privacySettings: newSettings };
    }),
  // Open settings modal
  openSettings: () => set({ isSettingsOpen: true }),
  // Close settings modal and trigger global context refresh
  closeSettings: () =>
    set(state => ({
      isSettingsOpen: false,
      globalContextVersion: state.globalContextVersion + 1,
    })),
  // Function to manually trigger global context refresh
  refreshGlobalContext: () =>
    set(state => ({
      globalContextVersion: state.globalContextVersion + 1,
    })),
}));

export default useStore;
