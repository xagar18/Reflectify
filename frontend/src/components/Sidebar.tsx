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

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      className={`bg-gray-900 border-r border-gray-700 h-screen flex flex-col
      transition-all duration-300
      ${isOpen ? "w-64" : "w-0 overflow-hidden"}`}
    >
      {/* ===== HEADER (FIXED) ===== */}
      <div className="p-4 space-y-3 border-b border-gray-700 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Reflectify 🌱</h2>

          <div className="relative group">
            <button
              onClick={onToggle}
              className="h-8 w-8 flex items-center justify-center rounded-md
              text-gray-400 hover:text-white hover:bg-gray-700"
            >
              ‹
            </button>

            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2
              text-xs bg-black px-2 py-1 rounded opacity-0
              group-hover:opacity-100 whitespace-nowrap">
              Close sidebar
            </div>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="w-full py-2 px-3 bg-gray-700 rounded
          hover:bg-gray-600 transition"
        >
          + New Reflection
        </button>

        <input
          type="text"
          placeholder="Search chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 rounded text-sm
          outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ===== CHAT LIST (ONLY THIS SCROLLS) ===== */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div
          className="flex items-center justify-between text-sm text-gray-400
          px-4 py-2 cursor-pointer hover:text-white shrink-0"
          onClick={() => setShowChats(!showChats)}
        >
          <span>Your chats</span>
          <span>{showChats ? "▾" : "▸"}</span>
        </div>

        {showChats && (
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {filteredChats.length === 0 ? (
              <div className="text-sm text-gray-500 px-2 py-4">
                No chats yet
              </div>
            ) : (
              filteredChats.map((chat) => (
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
      <div className="border-t border-gray-700 p-3 shrink-0">
        <ProfileMenu />
      </div>
    </aside>
  );
}

export default Sidebar;
