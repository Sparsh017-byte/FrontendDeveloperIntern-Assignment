import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  

  return (
    <>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>

        } />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App

