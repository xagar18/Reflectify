import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useStore from "../zustand/store";

/* ---------- Profile Menu ---------- */

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { userData, logout, theme, openSettings } = useStore();

  const LogoutCalled = () => {
    logout();
  };

  const handleSettingsClick = () => {
    setOpen(false);
    openSettings();
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      {/* Profile button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition ${
          theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"
        }`}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          {userData?.name ? userData.name.charAt(0).toUpperCase() : "P"}
        </div>
        <span className="flex-1 truncate text-left">Profile</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded border shadow-lg ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <button
            onClick={handleSettingsClick}
            className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition ${
              theme === "dark"
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={LogoutCalled}
            className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 transition ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
