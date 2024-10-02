import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // If you still need this for other styles
import ResumeForm from './components/ResumeForm1.jsx';
import Resume from './components/resume1.jsx';
import PrintButton from './components/PrintButton.jsx';
import data from './resumeData1.json';
import Home from './Pages/Home.jsx'; // Import Home component
import SignUpPage from './Pages/signup.jsx'; // Import your SignUpPage
import LoginPage from './Pages/loginPage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx'; // Import the 404 Page
import Dashboard from './components/dashboard.jsx';
import Navbar from './components/NavBar.jsx';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData); // Store user data upon login
  };

  const handleLogout = () => {
    setUser(null); // Clear user data on logout
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} /> {/* Pass user and logout function to Navbar */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Add Home Route */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage />} /> {/* Add SignUp Route */}
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
