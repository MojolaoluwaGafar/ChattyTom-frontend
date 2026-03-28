import React, { useEffect} from 'react';
import ChatHeader from "../../Components/Chat/ChatHeader";
import DefaultAvatar from "../../assets/defaultAvatar.png"
import MessageList from "../../Components/Chat/MessageList"
import ChatInput from "../../Components/Chat/ChatInput"
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../Components/Loader';
import { useChat } from '../../hooks/useChat';

type Props = {
  conversationId: string;
  onBack?: () => void;
};

export default function ConversationPage({ conversationId, onBack }: Props) {
  const { user } = useAuth()
  const { conversations,loadMessages, sendMessage, typingMap } = useChat()

    
  //load conversation data 
  useEffect(() => {
    if (!conversationId) return;
    loadMessages(conversationId);
  }, [conversationId]);

  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) return <Loader />;

  const loggedInUserId = Number(user?.id)
  const otherUser = conversation?.participants?.find(p => p.id !== loggedInUserId);
  const isGroupChat = conversation.is_group;
  const conversationName = conversation.display_name || (isGroupChat ? "Group Chat" : `${otherUser?.firstname} ${otherUser?.lastname}`)
  const avatar = isGroupChat ? DefaultAvatar : otherUser?.profile_image || DefaultAvatar;

  const handleSendMessage = (content : string)=>{
    sendMessage(conversation.id, content)
  }
  const typingUsers = typingMap[conversationId] || []

  return (
    <div className="h-screen flex flex-col">
      <ChatHeader
        name={conversationName}
        avatar={avatar}
        otherUserId={otherUser?.id}
        participants={conversation.participants}
        onBack={onBack}
      />

      <MessageList 
      messages={conversation.messages || []}
      loggedInUserId={loggedInUserId}
      participants={conversation.participants || []} />
      {typingUsers.length > 0 && (
        <div className='text-sm text-gray-500 italic px-4'>Typing...</div>
      )}

      <ChatInput
      onSend={handleSendMessage}
      conversationId={conversation.id}
      userId={loggedInUserId} />
    </div>
  );
}