import React from "react"
import { useTheme } from "../../Context/ThemeContext"


type ChatListItemProps = {
  id: string;
  img: string;
  name: string;
  lastMessage: string;
  updatedAt: string;
  onSelect: (id: string) => void;
};

export default function ChatListItem({
  id,
  img,
  name,
  lastMessage,
  updatedAt,
  onSelect,
}: ChatListItemProps) {
    const { theme } = useTheme()
    const bgClass = theme === "light" ? "bg-white" : "bg-gray-800";
    const textClass = theme === "light" ? "text-dark" : "text-white"
  return (
    <div
      onClick={() => onSelect(id)}
      className={`${bgClass} relative p-4 cursor-pointer hover:bg-gray-400 transition`}
    >
      <div className="flex items-center gap-4">
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={img}
          alt={name}
        />

        <div className="flex flex-col">
          <p className={`${textClass} font-semibold text-[20px]`}>{name}</p>
          <p className="text-[16px] text-gray-500 font-semibold truncate">
            {lastMessage || "No messages yet"}
          </p>
        </div>
      </div>

      <p className="absolute right-4 top-4 text-xs text-gray-400">
        {new Date(updatedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}