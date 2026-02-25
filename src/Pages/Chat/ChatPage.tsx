import React, {useState} from 'react'
import ChatList from "../../Components/Chat/ChatList"
import ConversationPage from './ConversationPage'


export default function ChatPage() {
    const [ conversation, setConversation ] = useState<boolean>(false)
  return (
    <div className="w-full">
      <div className="lg:hidden">
          <ChatList />
      </div>
       <div className="hidden lg:flex w-full">
        <div className="w-1/3"><ChatList /></div>
        {conversation ? <div className="w-2/3"><ConversationPage /></div> : <p className='text-3xl text-center w-2/3 mt-[15%]'>No conversation started </p>}
       </div>

    </div>
  )
}