import React, { useEffect }from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

type props ={
    children : React.ReactNode;
}

export default function ProtectRoute({ children } : props) {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  useEffect(()=>{
    if (!token || !user) {
        navigate("/login")
    }
  }, [token, navigate, user])
  

    return children;
}