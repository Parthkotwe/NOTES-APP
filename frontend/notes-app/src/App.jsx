import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/login'
import Signup from './pages/Signup/signup'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/signup' replace />} />

        <Route path='/dashboard' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
