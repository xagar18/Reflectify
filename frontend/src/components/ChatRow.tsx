import { useState } from "react";

/* ---------- Types ---------- */

type Chat = {
  id: number;
  title: string;
};

type ChatRowProps = {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onRename: (id: number, title: string) => void;
  onDelete: (id: number) => void;
};

/* ---------- Chat Row ---------- */

export default function ChatRow({
  chat,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: ChatRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(chat.title);

  // Save renamed title
  const save = () => {
    setIsEditing(false);
    onRename(chat.id, value.trim() || "Untitled Reflection");
  };

  return (
    <div
      onClick={!isEditing ? onSelect : undefined}
      className={`group flex items-center justify-between px-3 py-2 rounded cursor-pointer
        ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`}
    >
      {/* Title / Rename input */}
      {isEditing ? (
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={e => e.key === "Enter" && save()}
          autoFocus
          className="bg-gray-800 text-sm px-2 py-1 rounded w-full outline-none"
        />
      ) : (
        <span className="truncate text-sm">{chat.title}</span>
      )}

      {/* Hover actions */}
      {!isEditing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={e => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="text-xs text-gray-400 hover:text-white"
            aria-label="Rename chat"
          >
            ✏️
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(chat.id);
            }}
            className="text-xs text-red-400 hover:text-red-300"
            aria-label="Delete chat"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}
