import React, { useEffect, useState } from 'react';
import ChatHeader from "../../Components/Chat/ChatHeader";
import { getConversationById } from "../../API/conversationAPI";
import DefaultAvatar from "../../assets/defaultAvatar.png"
import MessageList from "../../Components/Chat/MessageList"
import ChatInput from "../../Components/Chat/ChatInput"
// import { sendMessage } from '../../API/messageAPI';
import { socket } from "../../Socket/socket"
import { useAuth } from '../../hooks/useAuth';

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

type Conversation = {
  id: string;
  name?: string | null;
  is_group: boolean;
  participants: Participant[];
  messages: Message[];
};

type Props = {
  conversationId: string;
  onBack?: () => void;
};

export default function ConversationPage({ conversationId, onBack }: Props) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const { user } = useAuth()

  //load conversationdata 
  useEffect(() => {
    const loadConversation = async () => {
      try {
        const data = await getConversationById(conversationId);
        setConversation(data);
      } catch (err) {
        console.error("Failed to load conversation", err);
      }
    };

    loadConversation();
  }, [conversationId]);

  //join convo when page loads
  useEffect(()=>{
    if (!conversation) return;
    socket.emit("join_conversation", conversation.id);

    return ()=>{
      socket.emit("leave_conversation", conversation.id)
    }
  }, [conversation]);

  //listen for incoming messages
  useEffect(()=>{
    const handleReceiveMessage = (message : Message)=>{
      setConversation(prev => prev ? {...prev, messages : [...prev.messages, message]} : prev
      );
    };
    socket.on("receive_message", handleReceiveMessage);
    
    return ()=>{
      socket.off("receive_message", handleReceiveMessage)
    }
  }, [])

  if (!conversation) return <p className="text-center mt-10">Loading...</p>;

  // Determine display name (other user for 1-on-1)
  const loggedInUserId = Number(user?.id)
  const otherUser = conversation?.participants?.find(p => p.id !== loggedInUserId);
  const isGroupChat = conversation.is_group;
  const conversationName = isGroupChat ? conversation.name || "Group Chat" : `${otherUser?.firstname} ${otherUser?.lastname}`;
  const avatar = isGroupChat ? DefaultAvatar : otherUser?.profile_image || DefaultAvatar;

  const handleSendMessage = async (
    content : string
  )=>{
    if (!conversation || !user) return;
    //send message through API
    // try {
    //   const newMessage = await sendMessage(conversation.id,content);
    //   setConversation(prev => prev
    //      ? {...prev,messages: [...prev.messages,newMessage]} 
    //      : prev);
    // } catch (error) {
    //   console.error("Failed to send message", error)
    // }
    //emit to socket
    socket.emit("send_message", {
      conversationId : conversation.id,
      senderId : user?.id,
      content,
    })
    //optimistic UI to display message immediately
    setConversation(prev => prev
    ? { ...prev, messages: [...prev.messages, { id: "temp-" + Date.now(), sender_id: user.id, content, created_at: new Date().toISOString() }] }
    : prev
  );
  }
  
  return (
    <div className="h-screen flex flex-col">
      <ChatHeader
        name={conversationName}
        avatar={avatar}
        isOnline={true}
        onBack={onBack}
      />

      <MessageList 
      messages={conversation.messages}
      loggedInUserId={loggedInUserId}
      participants={conversation.participants} />

      <ChatInput
      onSend={handleSendMessage} />
    </div>
  );
}