import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPortal from './components/AdminPortal';
import UserPortal from './components/UserPortal';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/signup" element={<Signup onSignup={setUser} />} />
        <Route path="/admin/*" element={
          user && user.role === 'admin' ? <AdminPortal /> : <Navigate to="/login" />
        } />
        <Route path="/user/*" element={
          user && user.role === 'user' ? <UserPortal /> : <Navigate to="/login" />
        } />
        <Route path="/*" element={
          user ? (
            user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/user" />
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
