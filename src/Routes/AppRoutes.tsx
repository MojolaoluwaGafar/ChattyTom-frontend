import { Routes, Route, Navigate } from "react-router";
import SignUp from "../Pages/Auth/SignUp";
import Login from "../Pages/Auth/Login"
import ChatPage from "../Pages/Chat/ChatPage";
import ProtectRoute from "../Components/ProtectRoute";
import { useState } from "react";
import Loader from "../Components/Loader"

export default function AppRoutes() {

  const [loading, setLoading]= useState<boolean>(false);
  if (loading) return <Loader />;

  return (
    <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat/*" element={<ProtectRoute><ChatPage /></ProtectRoute>}/>
        <Route path="*" element={<Navigate to="login" replace /> } />
    </Routes>
  )
}