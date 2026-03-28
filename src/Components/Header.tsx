import React from 'react'
import Logo from "../assets/ChattyTom Logo.png"
import { useTheme } from "../Context/ThemeContext"
import { FiSearch } from "react-icons/fi";
import { FaMicrophone } from "react-icons/fa6";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

export default function Header() {
    const { theme } = useTheme();
    
    const bgClass = theme === "light" ? "bg-[#4e6fe0]" : "bg-gray-900";
    const searchClass = theme === "light" ? "bg-[#4e6fe0]" : "bg-gray-900"
    const { logout } = useAuth();
    const navigate = useNavigate()

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    logout()
    navigate("/login")
  }
  return (
    <div>
      <div className={`${bgClass} h-25 flex lg:gap-0 px-2 items-center`}>
        <img className="w-20 lg:w-30" src={Logo} alt="" />
        <p className={`text-white text-2xl lg:text-3xl font-semibold `}>Chatty Tom</p>
      </div>
      <button onClick={handleLogout} type="button" className="bg-red-500 hover:bg-red-900 text-white rounded-md h-8 w-16 lg:h-8 lg:w-12 text-sm lg:text-xs font-semibold absolute top-10 right-5 lg:right-5 ">Logout</button>

        <div className={`${searchClass} relative flex items-center px-5 lg:px-8 py-2`}>
          <input className="w-full bg-white px-12 rounded-full h-12  text-[24px] " placeholder='Search' type="text" />
          <span className="absolute left-10 text-[25px] text-gray-500"><FiSearch /></span>
          <button className='absolute text-[25px] right-10 text-gray-500' type='button'><FaMicrophone /></button>
        </div>
    </div>
  )
}