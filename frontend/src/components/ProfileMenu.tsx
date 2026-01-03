import { useEffect, useRef, useState } from "react";
import useStore from "../zustand/store";

/* ---------- Profile Menu ---------- */

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { userData, logout } = useStore();

  const LogoutCalled = () => {
    logout();
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
        className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition hover:bg-gray-700"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          P
        </div>
        <span className="flex-1 truncate text-left">Profile</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded border border-gray-700 bg-gray-800 shadow-lg">
          {/* <button className="w-full px-4 py-2 text-left text-sm transition hover:bg-gray-700">
            Settings
          </button>
          <button className="w-full px-4 py-2 text-left text-sm transition hover:bg-gray-700">
            Help
          </button> */}
          <button
            onClick={LogoutCalled}
            className="w-full px-4 py-2 text-left text-sm text-red-400 transition hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
