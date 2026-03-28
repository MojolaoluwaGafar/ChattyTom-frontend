import { useTheme } from "../../Context/ThemeContext"

type ChatListItemProps = {
  id: string;
  img: string;
  name: string;
  lastMessage: string;
  isTyping? : boolean;
  unread: number;
  updatedAt: string;
  onSelect: (id: string) => void;
};

export default function ChatListItem({
  id,
  img,
  name,
  lastMessage,
  isTyping,
  unread,
  updatedAt,
  onSelect,
}: ChatListItemProps) {
    const { theme } = useTheme()
    const bgClass = theme === "light" ? "bg-white" : "bg-gray-800";
    const textClass = theme === "light" ? "text-dark" : "text-white"

  return (
    <div
      onClick={() => onSelect(id)}
      className={`${bgClass} relative p-4 lg:p-8 cursor-pointer hover:bg-gray-400 transition`}
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
            {isTyping ? "Typing..." : lastMessage}
          </p>
        </div>
      </div>

      <div className="absolute right-4 top-4 flex flex-col items-end">
        <span className="text-xs text-gray-400">{new Date(updatedAt).toLocaleTimeString([], { hour : "2-digit", minute : "2-digit"})}</span>
        {unread > 0 && <span className="bg-red-500 text-white text-xs px-2 rounded-full">{unread}</span>}
      </div>
    </div>
  );
}