import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Theme } from "../zustand/store";

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
  theme?: Theme;
};

/* ---------- Chat Row ---------- */

export default function ChatRow({
  chat,
  isActive,
  onSelect,
  onRename,
  onDelete,
  theme = "dark",
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
      className={`group flex cursor-pointer items-center justify-between rounded px-3 py-2 transition-colors ${
        theme === "dark"
          ? isActive
            ? "bg-gray-700"
            : "hover:bg-gray-700"
          : isActive
            ? "bg-blue-50 text-blue-700"
            : "hover:bg-gray-100"
      }`}
    >
      {/* Title / Rename input */}
      {isEditing ? (
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={e => e.key === "Enter" && save()}
          autoFocus
          className={`w-full rounded px-2 py-1 text-sm outline-none ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "border border-gray-300 bg-white text-gray-900"
          }`}
        />
      ) : (
        <span
          className={`truncate text-sm ${
            theme === "dark" ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {chat.title}
        </span>
      )}

      {/* Hover actions */}
      {!isEditing && (
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={e => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className={`rounded p-1 transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:bg-gray-600 hover:text-white"
                : "text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            }`}
            aria-label="Rename chat"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(chat.id);
            }}
            className={`rounded p-1 transition-colors ${
              theme === "dark"
                ? "text-red-400 hover:bg-red-500/20 hover:text-red-300"
                : "text-red-400 hover:bg-red-50 hover:text-red-500"
            }`}
            aria-label="Delete chat"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
