import { PanelRight } from "lucide-react";
import { useState } from "react";
import useStore from "../zustand/store";
import ChatRow from "./ChatRow";
import { ProfileMenu } from "./ProfileMenu";

type Chat = {
  id: string;
  title: string;
};

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, title: string) => void;
  onDeleteChat: (id: string) => void;
};

function Sidebar({
  isOpen,
  onToggle,
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const [showChats, setShowChats] = useState(true);
  const { theme } = useStore();

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onToggle}
        />
      )}
      <aside
        className={`flex h-screen flex-col transition-all duration-300 ${isOpen ? "w-64" : "w-0 overflow-hidden"} fixed z-50 md:relative md:z-auto ${
          theme === "dark"
            ? "border-r border-gray-800 bg-gray-900"
            : "border-r border-gray-200 bg-white"
        }`}
      >
        {/* ===== HEADER (FIXED) ===== */}
        <div
          className={`shrink-0 space-y-3 p-4 ${
            theme === "dark"
              ? "border-b border-gray-700"
              : "border-b border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-semibold ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
            >
              Reflectify
            </span>
            <button
              onClick={onToggle}
              className={`rounded-lg p-2 ${
                theme === "dark"
                  ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              <PanelRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onNewChat}
            className={`w-full rounded-lg px-3 py-2 font-medium transition ${
              theme === "dark"
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            + New Reflection
          </button>

          <input
            type="text"
            placeholder="Search chats"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${
              theme === "dark"
                ? "bg-gray-800 text-white placeholder-gray-400"
                : "border border-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        {/* ===== CHAT LIST (ONLY THIS SCROLLS) ===== */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div
            className={`flex shrink-0 cursor-pointer items-center justify-between px-4 py-2 text-sm transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
            onClick={() => setShowChats(!showChats)}
          >
            <span>Your chats</span>
            <span>{showChats ? "▾" : "▸"}</span>
          </div>

          {showChats && (
            <div
              className={`flex-1 space-y-1 overflow-y-auto px-2 ${
                theme === "dark"
                  ? "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/50 hover:scrollbar-thumb-gray-500"
                  : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
              }`}
            >
              {filteredChats.length === 0 ? (
                <div
                  className={`px-2 py-4 text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
                >
                  No chats yet
                </div>
              ) : (
                filteredChats.map(chat => (
                  <ChatRow
                    key={chat.id}
                    chat={chat}
                    isActive={chat.id === activeChatId}
                    onSelect={() => onSelectChat(chat.id)}
                    onRename={onRenameChat}
                    onDelete={onDeleteChat}
                    theme={theme}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* ===== PROFILE (FIXED BOTTOM) ===== */}
        <div
          className={`shrink-0 p-3 ${
            theme === "dark"
              ? "border-t border-gray-700"
              : "border-t border-gray-200"
          }`}
        >
          <ProfileMenu />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
