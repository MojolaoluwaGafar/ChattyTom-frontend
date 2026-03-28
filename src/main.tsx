import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from "react-toastify"
import { ThemeProvider } from "./Context/ThemeContext.tsx"
import { AuthProvider } from "./Context/AuthContext.tsx"
import { PresenceProvider } from './Context/PresenceContext.tsx'
import { ChatProvider } from './Context/ChatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <ChatProvider>
          <PresenceProvider>
          <ThemeProvider>
            <App />
        <ToastContainer  position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable />
          </ThemeProvider>
        </PresenceProvider>
        </ChatProvider>
      </AuthProvider>
  </StrictMode>,
)
