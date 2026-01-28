import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { globalContextService } from "../services/globalContextService";
import type { Language, PrivacySettings, ThemeOption } from "../zustand/store";
import useStore from "../zustand/store";

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSettings();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [closeSettings]);

  if (!isSettingsOpen) return null;

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "context", label: "AI Context" },
    { id: "privacy", label: "Privacy" },
    { id: "languages", label: "Language" },
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
        className={`relative z-10 flex h-[85vh] max-h-[650px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl shadow-xl ${
          theme === "dark"
            ? "border border-gray-800 bg-gray-900 text-white"
            : "border border-gray-200 bg-white text-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b px-6 py-4 ${
            theme === "dark" ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={closeSettings}
            className={`rounded-lg p-2 transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className={`w-44 shrink-0 border-r p-3 ${
              theme === "dark"
                ? "border-gray-800 bg-gray-900/50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? theme === "dark"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-500 text-white"
                      : theme === "dark"
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
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
            {activeTab === "context" && <ContextSettings theme={theme} />}
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
  const options: { value: ThemeOption; label: string }[] = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold">Appearance</h3>
      <p
        className={`mb-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
      >
        Choose your preferred theme
      </p>

      <div className="flex gap-3">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => setThemeOption(option.value)}
            className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
              themeOption === option.value
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : theme === "dark"
                  ? "border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600"
                  : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
            }`}
          >
            {option.label}
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
  const settings: {
    key: keyof PrivacySettings;
    label: string;
    desc: string;
  }[] = [
    {
      key: "saveHistory",
      label: "Save Chat History",
      desc: "Keep conversations for future reference",
    },
    {
      key: "shareAnalytics",
      label: "Share Analytics",
      desc: "Help improve Reflectify",
    },
    {
      key: "showOnlineStatus",
      label: "Show Online Status",
      desc: "Let others see when you're active",
    },
  ];

  return (
    <div>
      <h3 className="mb-4 text-base font-semibold">Privacy</h3>

      <div className="space-y-3">
        {settings.map(setting => (
          <div
            key={setting.key}
            className={`flex items-center justify-between rounded-lg p-4 ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <div>
              <div className="text-sm font-medium">{setting.label}</div>
              <div
                className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
              >
                {setting.desc}
              </div>
            </div>
            <button
              onClick={() =>
                setPrivacySettings({
                  [setting.key]: !privacySettings[setting.key],
                })
              }
              className={`relative h-6 w-11 rounded-full transition-colors ${
                privacySettings[setting.key]
                  ? "bg-emerald-500"
                  : theme === "dark"
                    ? "bg-gray-600"
                    : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                  privacySettings[setting.key] ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Clear Data */}
      <div
        className={`mt-6 rounded-lg border p-4 ${
          theme === "dark"
            ? "border-red-900/50 bg-red-950/20"
            : "border-red-200 bg-red-50"
        }`}
      >
        <h4
          className={`mb-2 text-sm font-medium ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
        >
          Clear All Data
        </h4>
        <p
          className={`mb-3 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Delete all chat history and preferences. Cannot be undone.
        </p>
        <button
          onClick={() => {
            if (confirm("Clear all data? This cannot be undone.")) {
              localStorage.removeItem("reflectify-chats");
              localStorage.removeItem("reflectify-active-chat-id");
              window.location.reload();
            }
          }}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
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
    <div>
      <h3 className="mb-4 text-base font-semibold">Language</h3>
      <p
        className={`mb-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
      >
        Choose your interface language
      </p>

      <div className="grid grid-cols-2 gap-2">
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`rounded-lg border-2 px-4 py-3 text-left text-sm transition-all ${
              language === lang.code
                ? "border-emerald-500 bg-emerald-500/10"
                : theme === "dark"
                  ? "border-gray-700 bg-gray-800 hover:border-gray-600"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
            }`}
          >
            <div
              className={`font-medium ${language === lang.code ? "text-emerald-400" : ""}`}
            >
              {lang.name}
            </div>
            <div
              className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
            >
              {lang.native}
            </div>
          </button>
        ))}
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
  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { refreshGlobalContext } = useStore();

  useEffect(() => {
    loadContextItems();
  }, []);

  const loadContextItems = async () => {
    try {
      const items = await globalContextService.getGlobalContext();
      setContextItems(items);
    } catch (error) {
      console.error("Error loading context:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setIsAdding(true);
    try {
      await globalContextService.setGlobalContext(
        newKey.trim(),
        newValue.trim()
      );
      setNewKey("");
      setNewValue("");
      setShowForm(false);
      await loadContextItems();
      refreshGlobalContext();
    } catch (error) {
      console.error("Error adding context:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await globalContextService.deleteGlobalContext(key);
      await loadContextItems();
      refreshGlobalContext();
    } catch (error) {
      console.error("Error deleting context:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 text-base font-semibold">AI Context</h3>
      <p
        className={`mb-4 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
      >
        Add info about yourself for personalized responses
      </p>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed p-3 text-sm font-medium transition-colors ${
            theme === "dark"
              ? "border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400"
              : "border-gray-300 text-gray-500 hover:border-emerald-500 hover:text-emerald-600"
          }`}
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      )}

      {/* Add Form */}
      {showForm && (
        <div
          className={`mb-4 rounded-lg p-4 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
        >
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Key (e.g., name, job)"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                theme === "dark"
                  ? "border-gray-700 bg-gray-900 text-white placeholder-gray-500"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
              } focus:border-emerald-500 focus:outline-none`}
            />
            <input
              type="text"
              placeholder="Value"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                theme === "dark"
                  ? "border-gray-700 bg-gray-900 text-white placeholder-gray-500"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-400"
              } focus:border-emerald-500 focus:outline-none`}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={isAdding || !newKey.trim() || !newValue.trim()}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  isAdding || !newKey.trim() || !newValue.trim()
                    ? "cursor-not-allowed bg-gray-500 text-gray-300"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                {isAdding ? "Adding..." : "Add"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="mt-4 space-y-2">
        {contextItems.length === 0 ? (
          <p
            className={`py-8 text-center text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
          >
            No context items yet
          </p>
        ) : (
          contextItems.map(item => (
            <div
              key={item.id}
              className={`group flex items-center justify-between rounded-lg p-3 ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-emerald-400">
                  {item.key}:
                </span>
                <span
                  className={`ml-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                >
                  {item.value}
                </span>
              </div>
              <button
                onClick={() => handleDelete(item.key)}
                className={`rounded p-1.5 opacity-0 transition-opacity group-hover:opacity-100 ${
                  theme === "dark"
                    ? "text-gray-500 hover:bg-gray-700 hover:text-red-400"
                    : "text-gray-400 hover:bg-gray-200 hover:text-red-500"
                }`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Settings;
