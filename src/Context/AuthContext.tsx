import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";

// Define auth context shape
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  created_at: string;
}

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
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(() => {
     try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
    } catch {
    return null;}});
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,});

  const signUp = async (formData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    try {
      const response = await api.post(
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

  const login = async (formData: { email: string; password: string }) => {
    try {
      const response = await api.post(
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

      return response.data;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, login, token }}>
      {children}
    </AuthContext.Provider>
  );
}
