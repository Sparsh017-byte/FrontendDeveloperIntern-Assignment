import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {user} = useAuth();
    const {loading} = useAuth();

    if(!user && loading === false)return <Navigate to="/login" replace />
  return (
    children
  )
}

export default ProtectedRoute