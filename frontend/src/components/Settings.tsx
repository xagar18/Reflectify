import {
  BarChart3,
  Eye,
  Languages,
  MessageSquare,
  Monitor,
  Moon,
  Save,
  Settings as SettingsIcon,
  Shield,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Language, PrivacySettings, ThemeOption } from "../zustand/store";
import useStore from "../zustand/store";
import { globalContextService } from "../services/globalContextService";

type SettingsTab = "general" | "privacy" | "languages" | "context";

const LANGUAGES: { code: Language; name: string; native: string }[] = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
];

function Settings() {
  const {
    theme,
    themeOption,
    language,
    privacySettings,
    isSettingsOpen,
    setThemeOption,
    setLanguage,
    setPrivacySettings,
    closeSettings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSettings();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeSettings]);

  if (!isSettingsOpen) return null;

  const tabs: {
    id: SettingsTab;
    label: string;
    icon: LucideIcon;
  }[] = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "context", label: "Context", icon: MessageSquare },
    { id: "languages", label: "Languages", icon: Languages },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeSettings}
      />

      {/* Modal */}
      <div
        className={`relative z-10 flex h-[85vh] max-h-150 w-full max-w-2xl flex-col overflow-hidden rounded-2xl shadow-2xl ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b px-6 py-4 ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="text-lg font-bold">Settings</h2>
          <button
            onClick={closeSettings}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div
            className={`w-48 shrink-0 border-r p-3 ${
              theme === "dark"
                ? "border-gray-700 bg-gray-800/50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "general" && (
              <GeneralSettings
                theme={theme}
                themeOption={themeOption}
                setThemeOption={setThemeOption}
              />
            )}
            {activeTab === "privacy" && (
              <PrivacySettingsPanel
                theme={theme}
                privacySettings={privacySettings}
                setPrivacySettings={setPrivacySettings}
              />
            )}
            {activeTab === "context" && (
              <ContextSettings
                theme={theme}
              />
            )}
            {activeTab === "languages" && (
              <LanguageSettings
                theme={theme}
                language={language}
                setLanguage={setLanguage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== General Settings ========== */
function GeneralSettings({
  theme,
  themeOption,
  setThemeOption,
}: {
  theme: "dark" | "light";
  themeOption: ThemeOption;
  setThemeOption: (option: ThemeOption) => void;
}) {
  const themeOptions: {
    value: ThemeOption;
    label: string;
    icon: LucideIcon;
    description: string;
  }[] = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "A bright, clean appearance",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Match your device settings",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-base font-semibold">Appearance</h3>
        <p
          className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          Customize how Reflectify looks on your device
        </p>
      </div>

      <div className="space-y-3">
        {themeOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setThemeOption(option.value)}
            className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
              themeOption === option.value
                ? theme === "dark"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-blue-500 bg-blue-50"
                : theme === "dark"
                  ? "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                themeOption === option.value ? "text-white" : ""
              }`}
            >
              <option.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{option.label}</div>
              <div
                className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                {option.description}
              </div>
            </div>
            {themeOption === option.value && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ========== Privacy Settings ========== */
function PrivacySettingsPanel({
  theme,
  privacySettings,
  setPrivacySettings,
}: {
  theme: "dark" | "light";
  privacySettings: PrivacySettings;
  setPrivacySettings: (settings: Partial<PrivacySettings>) => void;
}) {
  const settings = [
    {
      key: "saveHistory" as const,
      label: "Save Chat History",
      description: "Keep your conversations saved locally for future reference",
      icon: Save,
    },
    {
      key: "shareAnalytics" as const,
      label: "Share Analytics",
      description: "Help us improve by sharing anonymous usage data",
      icon: BarChart3,
    },
    {
      key: "showOnlineStatus" as const,
      label: "Show Online Status",
      description: "Let others see when you're active",
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-base font-semibold">Privacy</h3>
        <p
          className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          Manage your privacy preferences
        </p>
      </div>

      <div className="space-y-4">
        {settings.map(setting => (
          <div
            key={setting.key}
            className={`flex items-center justify-between rounded-xl border p-4 ${
              theme === "dark"
                ? "border-gray-700 bg-gray-800/50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                <setting.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium">{setting.label}</div>
                <div
                  className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  {setting.description}
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                setPrivacySettings({
                  [setting.key]: !privacySettings[setting.key],
                })
              }
              className={`relative h-7 w-12 rounded-full transition-colors ${
                privacySettings[setting.key]
                  ? "bg-blue-500"
                  : theme === "dark"
                    ? "bg-gray-600"
                    : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                  privacySettings[setting.key] ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Clear Data Button */}
      <div
        className={`rounded-xl border p-4 ${
          theme === "dark"
            ? "border-red-900/50 bg-red-900/20"
            : "border-red-200 bg-red-50"
        }`}
      >
        <h4
          className={`text-sm font-medium ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
        >
          Clear All Data
        </h4>
        <p
          className={`mt-1 mb-3 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          Delete all your chat history and preferences
        </p>
        <button
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to clear all data? This cannot be undone."
              )
            ) {
              localStorage.removeItem("reflectify-chats");
              localStorage.removeItem("reflectify-active-chat-id");
              window.location.reload();
            }
          }}
          className="rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600"
        >
          Clear Data
        </button>
      </div>
    </div>
  );
}

/* ========== Language Settings ========== */
function LanguageSettings({
  theme,
  language,
  setLanguage,
}: {
  theme: "dark" | "light";
  language: Language;
  setLanguage: (lang: Language) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-base font-semibold">Language</h3>
        <p
          className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          Choose your preferred language
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
              language === lang.code
                ? theme === "dark"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-blue-500 bg-blue-50"
                : theme === "dark"
                  ? "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <div className="flex-1">
              <div className="text-sm font-medium">{lang.name}</div>
              <div
                className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                {lang.native}
              </div>
            </div>
            {language === lang.code && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>

      <div
        className={`rounded-xl border p-4 ${
          theme === "dark"
            ? "border-gray-700 bg-gray-800/50"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <p
          className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
        >
          <span className="font-medium">Note:</span> Language settings will be
          applied to the interface. Chat responses will continue to be in your
          preferred language based on how you communicate.
        </p>
      </div>
    </div>
  );
}

/* ========== Context Settings ========== */
function ContextSettings({ theme }: { theme: "dark" | "light" }) {
  const [contextItems, setContextItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Load context items on mount
  useEffect(() => {
    loadContextItems();
  }, []);

  const loadContextItems = async () => {
    try {
      const items = await globalContextService.getGlobalContext();
      setContextItems(items);
    } catch (error) {
      console.error("Error loading context items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContext = async () => {
    if (!newKey.trim() || !newValue.trim()) return;

    setIsAdding(true);
    try {
      await globalContextService.setGlobalContext(newKey.trim(), newValue.trim(), newCategory.trim() || undefined);
      setNewKey("");
      setNewValue("");
      setNewCategory("");
      await loadContextItems();
    } catch (error) {
      console.error("Error adding context:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteContext = async (key: string) => {
    if (!confirm("Are you sure you want to delete this context item?")) return;

    try {
      await globalContextService.deleteGlobalContext(key);
      await loadContextItems();
    } catch (error) {
      console.error("Error deleting context:", error);
    }
  };

  const categories = ["personal", "professional", "preferences", "health", "other"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-1 text-base font-semibold">Global Context</h3>
          <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            Loading your context items...
          </p>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-1 text-base font-semibold">Global Context</h3>
        <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Store important information that the AI can reference across all conversations.
          This helps provide more personalized and relevant responses.
        </p>
      </div>

      {/* Add new context item */}
      <div className={`rounded-xl border p-4 ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}>
        <h4 className="text-sm font-medium mb-3">Add Context Item</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Key (e.g., name, age, occupation)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">Select category (optional)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Value (e.g., John Doe, 28, Software Engineer)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            rows={2}
            className={`w-full px-3 py-2 rounded-lg text-sm border resize-none ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
          <button
            onClick={handleAddContext}
            disabled={isAdding || !newKey.trim() || !newValue.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAdding || !newKey.trim() || !newValue.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isAdding ? "Adding..." : "Add Context"}
          </button>
        </div>
      </div>

      {/* Existing context items */}
      <div className={`rounded-xl border p-4 ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}>
        <h4 className="text-sm font-medium mb-3">Your Context Items ({contextItems.length})</h4>
        {contextItems.length === 0 ? (
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            No context items added yet. Add some information above to help the AI understand you better.
          </p>
        ) : (
          <div className="space-y-3">
            {contextItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  theme === "dark" ? "border-gray-600 bg-gray-700/50" : "border-gray-300 bg-white"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{item.key}</span>
                    {item.category && (
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        theme === "dark" ? "bg-gray-600 text-gray-300" : "bg-gray-200 text-gray-700"
                      }`}>
                        {item.category}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    {item.value}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteContext(item.key)}
                  className={`ml-3 p-1 rounded transition-colors ${
                    theme === "dark"
                      ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                      : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                  }`}
                  title="Delete context item"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`rounded-xl border p-4 ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}>
        <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          <span className="font-medium">Note:</span> Context items are used by the AI to provide more personalized responses.
          They are stored securely and only accessible to you. Common examples include your name, age, occupation, preferences, or important life details.
        </p>
      </div>
    </div>
  );
}

export default Settings;
