import { useEffect, useRef, useState } from "react";

/* ---------- Profile Menu ---------- */

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      {/* Profile button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition text-sm"
      >
        <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
          A
        </div>
        <span className="flex-1 text-left truncate">
          Archi Gupta
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-full bg-gray-800 border border-gray-700 rounded shadow-lg overflow-hidden z-50">
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition">
            Settings
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition">
            Help
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
