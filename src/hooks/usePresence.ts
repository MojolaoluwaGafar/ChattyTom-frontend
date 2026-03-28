import React, { useContext } from "react"
import { PresenceContext } from "../Context/PresenceContext"

export function usePresence(){
    const context = useContext(PresenceContext)
    if (!context) {
    throw new Error("usePresence must be used within a ContextProvider");
  }
  return context;
};