import { useState } from "react";
import ChatRow from "./ChatRow";
import { ProfileMenu } from "./ProfileMenu";

type Chat = {
  id: number;
  title: string;
};

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
  chats: Chat[];
  activeChatId: number | null;
  onNewChat: () => void;
  onSelectChat: (id: number) => void;
  onRenameChat: (id: number, title: string) => void;
  onDeleteChat: (id: number) => void;
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
        className={`flex h-screen flex-col border-r border-gray-700 bg-gray-900 transition-all duration-300 ${isOpen ? "w-64" : "w-0 overflow-hidden"} fixed z-50 md:relative md:z-auto`}
      >
        {/* ===== HEADER (FIXED) ===== */}
        <div className="shrink-0 space-y-3 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Reflectify 🌱</h2>

            <div className="group relative">
              <button
                onClick={onToggle}
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                ‹
              </button>

              <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 rounded bg-black px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100">
                Close sidebar
              </div>
            </div>
          </div>

          <button
            onClick={onNewChat}
            className="w-full rounded bg-gray-700 px-3 py-2 transition hover:bg-gray-600"
          >
            + New Reflection
          </button>

          <input
            type="text"
            placeholder="Search chats"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded bg-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ===== CHAT LIST (ONLY THIS SCROLLS) ===== */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div
            className="flex shrink-0 cursor-pointer items-center justify-between px-4 py-2 text-sm text-gray-400 hover:text-white"
            onClick={() => setShowChats(!showChats)}
          >
            <span>Your chats</span>
            <span>{showChats ? "▾" : "▸"}</span>
          </div>

          {showChats && (
            <div className="flex-1 space-y-1 overflow-y-auto px-2">
              {filteredChats.length === 0 ? (
                <div className="px-2 py-4 text-sm text-gray-500">
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
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* ===== PROFILE (FIXED BOTTOM) ===== */}
        <div className="shrink-0 border-t border-gray-700 p-3">
          <ProfileMenu />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
