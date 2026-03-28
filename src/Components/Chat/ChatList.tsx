import Header from "../Header";
import ChatListItem from "./ChatListItem";
import DefaultAvatar from "../../assets/defaultAvatar.png"
import { useTheme } from "../../Context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { useChat } from "../../hooks/useChat";


export default function ChatList() {
  const { conversations, typingMap, handleSelectConversation } = useChat()
  const { user } = useAuth();  
  const { theme } = useTheme();
  const bgClass = theme === "light" ? "" : "bg-gray-800" 

  return (
    <div className={`${bgClass} h-screen relative`}>
      <Header />

      <div className="divide-y divide-gray-700">
        {conversations.map((conv) => {
          const displayName = conv.display_name
            ? conv.display_name
            : conv.participants?.filter((p: any) => p.id !== user?.id)
                .map((p : any) => `${p.firstname} ${p.lastname}`)
                .join(", ");

          const otherUser = conv.participants?.find(
            (p: any) => p.id !== user?.id
          );

          return (
            <ChatListItem
              key={conv.id + conv.last_message}
              id={conv.id}
              name={displayName}
              img={
                otherUser?.profile_image || DefaultAvatar
              }
              lastMessage={conv.last_message || ""}
              isTyping={typingMap[String(conv.id)]?.length > 0}
              unread={conv.unread}
              updatedAt={conv.updated_at}
              onSelect={handleSelectConversation}
            />
          );
        })}
      </div>
    </div>
  );
}