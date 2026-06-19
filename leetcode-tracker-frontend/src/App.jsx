import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Analytics from './pages/Analytics';
import Practice from './pages/Practice';
import Roadmap from './pages/Roadmap';
import Layout from './components/Layout';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  const handleLogin = (newToken) => {
    localStorage.setItem('jwtToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          
          {/* Protected Routes wrapped in Sidebar Layout */}
          <Route path="/" element={token ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard token={token} />} />
            <Route path="profile" element={<Profile token={token} />} />
            <Route path="edit-profile" element={<EditProfile token={token} />} />
            <Route path="analytics" element={<Analytics token={token} />} />
            <Route path="practice" element={<Practice token={token} />} />
            <Route path="roadmap" element={<Roadmap token={token} />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
