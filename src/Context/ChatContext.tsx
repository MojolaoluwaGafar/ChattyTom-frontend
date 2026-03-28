import { createContext, useEffect, useState, useRef } from "react";
import { socket } from "../Socket/socket";
import { getConversationById, getMyConversations } from "../API/conversationAPI";
import { useAuth } from "../hooks/useAuth";

type ChatContextType = {
  conversations: any[];
  selectedConversationId: string | null;
  setSelectedConversationId: (id: string | null) => void;
  typingMap: Record<string, number[]>;
  setConversations: React.Dispatch<React.SetStateAction<any[]>>;
  handleSelectConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  startTyping: (conversationId: string, userId: number) => void;
  stopTyping: (conversationId: string, userId: number) => void;
  loadMessages: (conversationId: string) => void;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [typingMap, setTypingMap] = useState<Record<string, number[]>>({});
  const selectedConversationRef = useRef<string | null>(null);

  useEffect(() => {
    selectedConversationRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Load conversations on login
  useEffect(() => {
    if (!user) return;
    const loadConversations = async () => {
      const data = await getMyConversations();
      setConversations(data);
      
    };
    loadConversations();
  }, [user]);

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await getConversationById(conversationId);
      
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? {
                ...c,
                messages: data.messages,
                participants: data.participants || c.participants,
              }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to load messages", error);
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    selectedConversationRef.current = id;
    socket.emit("join_conversation", id);
    socket.emit("mark_read", {
      conversationId: id,
      userId: user?.id,
    });
  };

  const sendMessage = (conversationId: string, content: string) => {
    if (!user || !content.trim()) return;

    // Optimistic message
    const tempMessage = {
      id: crypto.randomUUID(),
      temp: true,
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      created_at: new Date().toISOString(),
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...(c.messages || []), tempMessage], last_message: content }
          : c
      )
    );

    socket.emit("send_message", {
      conversationId,
      senderId: user.id,
      content,
    });
  };

  const startTyping = (conversationId: string, userId: number) => {
    socket.emit("user_typing", { conversationId, userId });
  };
  const stopTyping = (conversationId: string, userId: number) => {
    socket.emit("user_stop_typing", { conversationId, userId });
  };

  // Socket listeners
  useEffect(() => {
    if (!user) return;
    if (!socket.connected) socket.connect();

    const handleMessage = (msg: any) => {
      setConversations(prev =>
        prev.map(c => {
          if (c.id !== msg.conversation_id) return c;

          // Replace temp message if exists
          let messages = c.messages || [];
          messages = messages.map(m =>
            m.temp && m.sender_id === msg.sender_id && m.content === msg.content ? msg : m
          );

          // Avoid duplicate
          if (!messages.some(m => m.id === msg.id)) messages.push(msg);

          const currentUnread = Number(c.unread) || 0;

          return {
            ...c,
            messages,
            last_message: msg.content,
            updated_at: msg.created_at || new Date().toISOString(),
            unread:
              msg.sender_id !== user.id && c.id !== selectedConversationRef.current
                ? currentUnread + 1
                : currentUnread,
          };
        })
      );

      // clear typing
      setTypingMap(prev => {
        const updated = { ...prev };
        delete updated[msg.conversation_id];
        return updated;
      });
    };

    const handleTyping = ({ conversationId, userId }: any) => {
      if (userId === user.id) return;
      setTypingMap(prev => ({
        ...prev,
        [conversationId]: prev[conversationId] ? [...new Set([...prev[conversationId], userId])] : [userId],
      }));
    };

    const handleStopTyping = ({ conversationId, userId }: any) => {
      setTypingMap(prev => {
        const updated = { ...prev };
        updated[conversationId] = (updated[conversationId] || []).filter(id => id !== userId);
        if (updated[conversationId].length === 0) delete updated[conversationId];
        return updated;
      });
    };

    const handleMessageRead = ({ conversationId }: any) => {
      setConversations(prev =>
        prev.map(c => (c.id === conversationId ? { ...c, unread: 0 } : c))
      );
    };

    socket.on("receive_message", handleMessage);
    socket.on("user_typing", handleTyping);
    socket.on("user_stop_typing", handleStopTyping);
    socket.on("message_read", handleMessageRead);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("user_typing", handleTyping);
      socket.off("user_stop_typing", handleStopTyping);
      socket.off("message_read", handleMessageRead);
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        typingMap,
        loadMessages,
        setConversations,
        selectedConversationId,
        setSelectedConversationId,
        handleSelectConversation,
        sendMessage,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}