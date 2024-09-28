import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // If you still need this for other styles
import ResumeForm from './components/ResumeForm1.jsx';
import Resume from './components/resume1.jsx';
import PrintButton from './components/PrintButton.jsx';
import data from './resumeData1.json';
import Home from './Pages/Home.jsx';
import SignUpPage from './Pages/signup.jsx'; // Import your SignUpPage
import LoginPage from './Pages/loginPage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx'; // Import the 404 Page
import Dashboard from './components/dashboard.jsx';

function App() {
  const [count, setCount] = useState(0);
  const storedData = JSON.parse(localStorage.getItem("resumeFormData"));

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />
          
          {/* Sign Up page route */}
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Login page route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />

          
          {/* Resume builder route */}
          <Route 
            path="/builder" 
            element={
              <div className="flex flex-row h-screen">
                {/* Resume on the left */}
                <div className="w-1/2 bg-gray-100 p-4">
                  <Resume resumeData={storedData || data} />
                </div>

                {/* Form on the right, hidden during print */}
                <div className="w-1/2 bg-white p-4 hide-on-print">
                  <ResumeForm />
                </div>
              </div>
            } 
          />
          
          {/* 404 Not Found page route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
