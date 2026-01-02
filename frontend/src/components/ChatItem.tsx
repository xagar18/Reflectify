import { useState } from "react";

type ChatItemProps = {
  title: string;
  onDelete: () => void;
};

function ChatItem({ title, onDelete }: ChatItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className="group flex items-center justify-between px-3 py-2 rounded hover:bg-gray-700"
    >
      <span className="text-sm truncate">{title}</span>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="opacity-0 group-hover:opacity-100 transition"
        >
          ⋮
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-1 bg-gray-900 border border-gray-700 rounded shadow text-sm">
            <button className="block px-3 py-2 hover:bg-gray-700 w-full text-left">
              Rename
            </button>
            <button className="block px-3 py-2 hover:bg-gray-700 w-full text-left">
              Pin
            </button>
            <button
              onClick={onDelete}
              className="block px-3 py-2 hover:bg-red-600 w-full text-left text-red-400"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatItem;
