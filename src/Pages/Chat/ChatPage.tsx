import React, {useState} from 'react'
import ChatList from "../../Components/Chat/ChatList"
import ConversationPage from './ConversationPage'


export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="lg:hidden">
        {!selectedConversationId ? (
          <ChatList onSelectConversation={setSelectedConversationId} />
        ) : (
          <ConversationPage
            conversationId={selectedConversationId}
            onBack={() => setSelectedConversationId(null)}
          />
        )}
      </div>

      <div className="hidden lg:flex w-full">
        <div className="w-1/3 border-gray-700 border-r">
          <ChatList onSelectConversation={setSelectedConversationId} />
        </div>

        <div className="w-2/3">
          {selectedConversationId ? (
            <ConversationPage
              conversationId={selectedConversationId}
            />
          ) : (
            <p className="text-3xl text-center mt-[15%]">
              Select a conversation
            </p>
          )}
        </div>
      </div>
    </div>
  );
}