import React from 'react'
import Logo from "../assets/chattyTom logo.png"
import { useTheme } from "../Context/ThemeContext"
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa6";

type AuthLayoutProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, className, children }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  // Tailwind classes based on theme
  const bgClass = theme === "light" ? "bg-[#4e6fe0]" : "bg-gray-900";
  const cardClass = theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white";


  return (
    <div className={`${className} ${bgClass} w-full h-screen flex items-center justify-center`}>
      <div className={`${cardClass} relative rounded-lg w-[80%] lg:w-xl flex flex-col items-center justify-center`}>
        <img className="h-30 object-contain absolute -top-15" src={Logo} alt="" />
        <h1 className='font-bold text-2xl pt-8 pb-1'>Chatty Tom</h1>
        <h1 className='font-semibold text-xl'>{title}</h1>
        {children}

         <button
          type='button'
          onClick={toggleTheme}
          className="absolute bottom-4 right-4"
        >
          {theme ?  <FaToggleOff /> : <FaToggleOn />}
        </button>

      </div>
    </div>
  )
}