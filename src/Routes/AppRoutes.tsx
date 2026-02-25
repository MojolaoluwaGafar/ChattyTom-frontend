import { Routes, Route, Navigate } from "react-router";
import SignUp from "../Pages/Auth/SignUp";
import Login from "../Pages/Auth/Login"
import ChatPage from "../Pages/Chat/ChatPage";
import { useAuth } from "../hooks/useAuth"


export default function AppRoutes() {
    const { user } = useAuth()

  return (
    <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat/*" element={user ? <ChatPage /> : <Navigate to="/login" replace />}/>
        <Route path="*" element={<Navigate to={user ? '/chat' : '/login'} />} />
    </Routes>
  )
}