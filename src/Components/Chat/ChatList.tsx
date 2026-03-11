import { useEffect, useState } from "react";
import Header from "../Header";
import { getMyConversations } from "../../API/conversationAPI";
import ChatListItem from "./ChatListItem";
import { useAuth } from "../../hooks/useAuth";
import DefaultAvatar from "../../assets/defaultAvatar.png"
import { useTheme } from "../../Context/ThemeContext";

type Participant = {
  id: number;
  firstname: string;
  lastname: string;
  profile_image?: string;
};

type Conversation = {
  id: string;
  display_name?: string | null;
  updated_at: string;
  last_message?: string;
  participants: Participant[];
};

type Props = {
  onSelectConversation: (id: string) => void;
};

export default function ChatList({ onSelectConversation }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { user } = useAuth();
  const { theme } = useTheme()
  const bgClass = theme === "light" ? "" : "bg-gray-800" 

  useEffect(() => {
    const load = async () => {
      const data = await getMyConversations();
    //   const ids = data.map((c: Conversation) => c.id);
    //   const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    //   console.log("Duplicate conversation IDs:", duplicates);

      setConversations(data);
    };

    load();
  }, []);

  return (
    <div className={`${bgClass} h-screen`}>
      <Header />

      <div className="divide-y divide-gray-700">
        {conversations.map((conv) => {
          // Compute name dynamically
          const displayName = conv.display_name
            ? conv.display_name // group chat
            : conv.participants?.filter((p) => p.id !== user?.id)
                .map((p) => `${p.firstname} ${p.lastname}`)
                .join(", ");

          // Pick avatar (first other participant)
          const otherUser = conv.participants?.find(
            (p) => p.id !== user?.id
          );

          return (
            <ChatListItem
              key={conv.id}
              id={conv.id}
              img={
                otherUser?.profile_image || DefaultAvatar
              }
              name={displayName}
              lastMessage={conv.last_message || ""}
              updatedAt={conv.updated_at}
              onSelect={onSelectConversation}
            />
          );
        })}
      </div>
    </div>
  );
}