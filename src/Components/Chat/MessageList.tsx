import React, { useEffect, useRef, useState } from 'react';
import DefaultAvatar from "../../assets/defaultAvatar.png";
import { useTheme } from '../../Context/ThemeContext';
import { FaArrowDown } from "react-icons/fa";

type Participant = {
  id: number;
  firstname: string;
  lastname: string;
  profile_image?: string;
};

type Message = {
  id: string;
  sender_id: number;
  content: string;
  created_at: string;
};

type Props = {
  messages: Message[];
  loggedInUserId: number;
  participants: Participant[];
};

export default function MessageList({ messages, loggedInUserId, participants }: Props) {
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const [showMessageBtn, setShowMessageBtn] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme()
  const bgClass = theme === "light" ? "" : "bg-gray-700"
  const myMsgBg = theme === "light" ? "bg-[#4e6fe0]" : "bg-gray-800"
 
  const handleScroll = ()=>{
    const el = containerRef.current;
    if (!el) return;

    const threshold = 100
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

    setIsAtBottom(atBottom)
    setShowMessageBtn(!atBottom)
  }

  useEffect(() => {
    if (isAtBottom) {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setShowMessageBtn(false)
    } else {
      setShowMessageBtn(true)
    }
  }, [messages, isAtBottom]);

  if (!messages || messages.length === 0) {
    return <p className="text-gray-500">No messages yet</p>;
  }

  return (
    <div ref={containerRef} 
    onScroll={handleScroll} 
    className={`${bgClass} flex-1 p-4 overflow-y-auto space-y-2`}>
      {messages.map(msg => {
  const sender = participants.find(p => p.id === msg.sender_id);
  const isMine = msg.sender_id === loggedInUserId;
  const isDm  = participants.length === 2;
  const isOtherUser = msg.sender_id != loggedInUserId

  return (
    <div
      key={msg.id}
      className={`flex w-full items-end ${isMine ? "justify-end" : "justify-start"}`}
    >
      {!isMine && (
        <img
          src={sender?.profile_image || DefaultAvatar}
          alt=""
          className="w-6 h-6 rounded-full mr-2"
        />
      )}

      <div
        className={`p-2 rounded-md max-w-[70%] break-words ${
          isMine ? `${myMsgBg} text-white opacity-90` : "bg-gray-200 text-black opacity-80"
        }`}
      >
          {isMine && isDm ? "" : isMine ? <p className="text-lg text-dark font-semibold mb-1 opacity-80">Me</p> : isOtherUser && isDm ? "" : <p className="text-lg text-dark font-semibold mb-1 opacity-80">{sender?.firstname}</p>}

        <p className='text-lg'>{msg.content}</p>

        <div className="text-xs text-gray-400 mt-1 text-right">
          {new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

    </div>
    );
    })}
    {showMessageBtn && (
      <button onClick={()=> containerRef.current?.scrollTo({
        top : containerRef.current.scrollHeight,
        behavior : "smooth",
      })}
      className='absolute bottom-20 right-6 bg-gradient-to-b from-[#6f9df2] via-[#5C86E8] via-[#4E6FE0] via-[#2E3FAF] to-[#9BB8FF] text-white h-8 w-8 flex justify-center items-center rounded-full shadow'>
        <FaArrowDown />
      </button>
    )}
    </div>
  );
}