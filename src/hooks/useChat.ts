import React, { useContext } from "react"
import { ChatContext } from "../Context/ChatContext"

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error("useChat must be used inside ChatProvider")
  }

  return ctx
}