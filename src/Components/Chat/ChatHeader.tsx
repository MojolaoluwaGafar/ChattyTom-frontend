import React from 'react'
import { FaPhone, FaVideo } from "react-icons/fa6";
import DefaultAvatar from "../../assets/defaultAvatar.png"
import { useTheme } from "../../Context/ThemeContext"
import { IoArrowBackOutline } from "react-icons/io5";
import { usePresence } from '../../hooks/usePresence';
import type { Participant } from '../../types/participants';


type Props = {
  name: string;
  avatar?: string;
  otherUserId? : number,
  participants?: Participant[] 
  onBack?: () => void;
};

export default function ChatHeader({
  name,
  avatar,
  otherUserId,
  participants,
  onBack,
}: Props) {
    const { theme } = useTheme()
    const { onlineUsers } = usePresence()
    const bgClass = theme === "light" ? "bg-[#4e6fe0]" : "bg-gray-900";
    const textClass = theme === "light" ? "text-white" : "text-white opacity-80"
    const isDm  = participants?.length === 2;
    const isOnline = otherUserId ? onlineUsers.includes(otherUserId) : false;
    const visible = participants?.slice(0,3).map(p => p.firstname).join(", ");
    const remaining = (participants?.length || 0) - 3;
    const memberNames = remaining > 0 ? `${visible} +${remaining}` : visible;
        
  return (
    <div className={`${bgClass} h-20 flex items-center justify-between px-4 shadow-lg border-b`}>
      <div className="flex items-center gap-3">   
          <button type='button'
            onClick={onBack}
            className="lg:hidden text-3xl mr-2 text-gray-300"
          >
            <IoArrowBackOutline />
          </button>

        <img
          className="h-12 w-12 rounded-full object-cover"
          src={avatar || DefaultAvatar}
          alt={name}
        />

        <div>
          <p className={`${textClass} font-semibold`}>{name}</p>

          {isDm ?
            <p className={isOnline ? "text-green-600" : "text-red-400"}>{isOnline ? "Online" : "Offline"}</p>
          : <p className="text-gray-500">{memberNames}</p>}
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