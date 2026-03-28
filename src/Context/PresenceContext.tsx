import { createContext, useEffect, useState } from "react";
import { socket } from "../Socket/socket";

type PresenceContextType = {
  onlineUsers: number[];
};

export const PresenceContext = createContext<PresenceContextType>({
  onlineUsers: [],
});

interface PresenceProviderProps {
  children: React.ReactNode;
}

export function PresenceProvider({ children }: PresenceProviderProps) {
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  useEffect(() => {

  const handleOnlineUsers = (users: number[]) => {
    setOnlineUsers(users);
  };

  socket.on("online_users", handleOnlineUsers);

  return () => {
    socket.off("online_users", handleOnlineUsers);
  };

  }, []);
  
  useEffect(() => {
    socket.on("user_online", (userId: number) => {
      setOnlineUsers(prev => [...new Set([...prev, userId])]);
    });

    socket.on("user_offline", (userId: number) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    return () => {
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, []);

  return (
    <PresenceContext.Provider value={{ onlineUsers }}>
      {children}
    </PresenceContext.Provider>
  );
}

