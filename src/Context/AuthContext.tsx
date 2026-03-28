import React, { createContext, useState, useEffect } from "react";
import API from "../API/client"
import { socket } from "../Socket/socket"
import type { User } from "../types/user";

interface AuthContextType {
  token : string | null;
  user: User | null;
  signUp: (formData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => void;
  login: (formData: {
    email: string;
    password: string;
  }) => void;
  logout : ()=> void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
     try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
    } catch {
    return null;}});
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  useEffect(() => {
  if (user && !socket.connected) {
    socket.auth = { userId: user.id };
    socket.connect();
  }
}, [user]);

  const signUp = async (formData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    try {
      const response = await API.post(
        `/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      console.error("Signup failed:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  const login = async (formData: {
     email: string; 
     password: string 
    }) => {
    try {
      const response = await API.post(
        `/auth/signin`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const loggedInUser= response.data.user;
      const token = response.data.token;
      setUser(loggedInUser);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("userId", loggedInUser.id.toString());

      socket.auth = {
        userId : loggedInUser.id
      }
      if (!socket.connected) {
        socket.connect()
      }
      return response.data;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  const logout = () => {
    socket.disconnect();
    setUser(null);
    setToken(null);
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.clear()
    sessionStorage.clear()
   };

  return (
    <AuthContext.Provider value={{ user, signUp, login,logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}
