import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from "react-toastify"
import { ThemeProvider } from "./Context/ThemeContext.tsx"
import { AuthProvider } from "./Context/AuthContext.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <ToastContainer  position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
