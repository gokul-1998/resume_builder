import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // If you still need this for other styles
import ResumeForm from './components/ResumeForm1.jsx';
import Resume from './components/resume1.jsx';
import PrintButton from './components/PrintButton.jsx';
import { checkAuth } from './features/auth/authSlice';
import { store } from './app/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import data from './resumeData1.json';
import Home from './Pages/Home.jsx'; // Import Home component
import SignUpPage from './Pages/signup.jsx'; // Import your SignUpPage
import LoginPage from './Pages/loginPage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx'; // Import the 404 Page
import Dashboard from './components/dashboard.jsx';
import Navbar from './components/NavBar.jsx';

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
function AppContent() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);



  return (
    <Router>
      <Navbar /> {/* Pass user and logout function to Navbar */}
      <Routes>
        {/* <Route path="/" element={<Home />} /> Add Home Route */}
        <Route path="/login" element={<LoginPage  />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/signup" element={<SignUpPage />} /> {/* Add SignUp Route */}
     
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
