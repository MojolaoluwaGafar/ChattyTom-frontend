import React from 'react'
import Logo from "../assets/ChattyTom Logo.png"
import { useTheme } from "../Context/ThemeContext"
import { FiSearch } from "react-icons/fi";
import { FaMicrophone } from "react-icons/fa6";

export default function Header() {
    const { theme } = useTheme();
    
    const bgClass = theme === "light" ? "bg-[#4e6fe0]" : "bg-gray-900";
    const searchClass = theme === "light" ? "bg-[#6b8af1]" : "bg-gray-800"

  return (
    <div>
      <div className={`${bgClass} h-25 flex items-center`}>
        <img className="w-30" src={Logo} alt="" />
        <p className={`text-white text-4xl font-semibold `}>Chatty Tom</p>
      </div>

        <div className={`${searchClass} relative flex items-center px-3 py-2`}>
          <input className="w-full bg-white px-12 rounded-full h-12  text-[24px] " placeholder='Search' type="text" />
          <span className="absolute left-7 text-[25px] text-gray-500"><FiSearch /></span>
          <button className='absolute text-[25px] right-7 text-gray-500' type='button'><FaMicrophone /></button>
        </div>
    </div>
  )
}