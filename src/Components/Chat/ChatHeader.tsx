import React from 'react'
// import { useAuth } from "../../Context/AuthContext"
import { FaPhone, FaVideo } from "react-icons/fa6";
import DefaultAvatar from "../../assets/defaultAvatar.png"
import { useTheme } from "../../Context/ThemeContext"
import { IoArrowBackOutline } from "react-icons/io5";

type Props = {
  name: string;
  avatar?: string;
  isOnline?: boolean;
  onBack?: () => void;
};

export default function ChatHeader({
  name,
  avatar,
  isOnline = false,
  onBack,
}: Props) {
    const { theme } = useTheme()
    const bgClass = theme === "light" ? "bg-[#4e6fe0]" : "bg-gray-900";
    const textClass = theme === "light" ? "text-white" : "text-white opacity-30"
  return (
    <div className={`${bgClass} h-20 flex items-center justify-between px-4 shadow-lg border-b`}>
      <div className="flex items-center gap-3">   
        {onBack && (
          <button type='button'
            onClick={onBack}
            className="lg:hidden text-3xl mr-2 text-gray-300"
          >
            <IoArrowBackOutline />
          </button>
        )}

        <img
          className="h-12 w-12 rounded-full object-cover"
          src={avatar || DefaultAvatar}
          alt={name}
        />

        <div>
          <p className={`${textClass} font-semibold`}>{name}</p>
          <p className={isOnline ? "text-green-600" : "text-gray-400"}>
            {isOnline && <span>Online</span>}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-gray-200">
        <button
          type="button"
          className={`${textClass} text-[22px] hover:text-black transition`}
        >
          <FaPhone />
        </button>

        <button
          type="button"
          className={`${textClass} text-[22px] hover:text-black transition`}
        >
          <FaVideo />
        </button>
      </div>
    </div>
  );
}