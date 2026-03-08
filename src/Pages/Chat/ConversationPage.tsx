import React, { useEffect, useState } from 'react';
import ChatHeader from "../../Components/Chat/ChatHeader";
import { getConversationById } from "../../API/conversationAPI";
import DefaultAvatar from "../../assets/defaultAvatar.png"
import MessageList from "../../Components/Chat/MessageList"
import ChatInput from "../../Components/Chat/ChatInput"
import { sendMessage } from '../../API/messageAPI';

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

  if (!conversation) return <p className="text-center mt-10">Loading...</p>;

  // Determine display name (other user for 1-on-1)
  const loggedInUserId = Number(localStorage.getItem("userId"));
  const otherUser = conversation?.participants?.find(p => p.id !== loggedInUserId);
  const isGroupChat = conversation.is_group;
  const conversationName = isGroupChat ? conversation.name || "Group Chat" : `${otherUser?.firstname} ${otherUser?.lastname}`;
  const avatar = isGroupChat ? DefaultAvatar : otherUser?.profile_image || DefaultAvatar;

  const handleSendMessage = async (
    content : string
  )=>{
    if (!conversation) return;
    try {
      const newMessage = await sendMessage(conversation.id,content);
      setConversation(prev => prev
         ? {...prev,messages: [...prev.messages,newMessage]} 
         : prev);
    } catch (error) {
      console.error("Failed to send message", error)
    }
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