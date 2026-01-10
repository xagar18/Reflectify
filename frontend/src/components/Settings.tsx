import {
  BarChart3,
  Eye,
  Languages,
  Monitor,
  Moon,
  Save,
  Settings as SettingsIcon,
  Shield,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Language, ThemeOption } from "../zustand/store";
import useStore from "../zustand/store";

type SettingsTab = "general" | "privacy" | "languages";

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
    icon: React.ComponentType<any>;
  }[] = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "privacy", label: "Privacy", icon: Shield },
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
    icon: React.ComponentType<any>;
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
  privacySettings: {
    saveHistory: boolean;
    shareAnalytics: boolean;
    showOnlineStatus: boolean;
  };
  setPrivacySettings: (settings: Partial<typeof privacySettings>) => void;
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

export default Settings;
