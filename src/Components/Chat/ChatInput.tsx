import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { RiMessage3Line } from "react-icons/ri";
import { GrEmoji } from "react-icons/gr";
import { useTheme } from "../../Context/ThemeContext";

type Props = {
  onSend: (message: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState("");

  const { theme } = useTheme()
  const bgClass = theme === "light" ? "" : "bg-gray-900 text-white" 
  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={`${bgClass} h-16 shadow-2xl flex items-center px-4 gap-3 relative`}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 h-10 pl-10 rounded-xl border border-gray-300  outline-none focus:ring-2 focus:ring-[#4e6fe0]"
      />
      <span className="absolute opacity-70 left-6"><RiMessage3Line size={23} /></span>
      <span className="absolute right-20"><GrEmoji size={23} /></span>
      <button
        type="button"
        onClick={handleSend}
        className="h-10 w-10 bg-gradient-to-b from-[#bgf9df2] via-[#5C86E8] via-[#4E6FE0] via-[#2E3FAF] to-[#9BB8FF] flex items-center justify-center rounded-xl bg-[#4e6fe0] text-white hover:opacity-90 transition"
      >
        <IoIosSend size={25} /> 
      </button>
    </div>
  );
}