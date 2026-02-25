import React from 'react'
// import { useAuth } from "../../Context/AuthContext"
import { FaPhone } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import DefaultAvatar from "../../assets/defaultAvatar.png"

export default function ChatHeader() {
    // const { user } = useAuth()
  return (
    <div className="h-25 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
            <img className='border rounded-full h-12 w-12'  src={DefaultAvatar} alt="" />
            <div>
                {/* <p>{user.firstName}</p> */}
                <p>is Online</p>
            </div>
        </div>

        <div className='flex items-center gap-3'>
        <button type='button' className="text-gray-500 text-[25px]"><FaPhone /></button>
        <button type='button' className="text-gray-500 text-[28px]"><FaVideo /></button>
        </div>
    </div>
  )
}