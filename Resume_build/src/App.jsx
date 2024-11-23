import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { store } from './app/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AuthProvider } from './context/AuthContext';

import Home from './Pages/Home.jsx';
import SignUpPage from './Pages/signup.jsx';
import LoginPage from './Pages/loginPage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import Dashboard from './components/dashboard.jsx';
import Navbar from './components/NavBar.jsx';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute.jsx';
import NewResume from './components/NewResume.jsx';
import NewAIResume from './components/NewAIResume.jsx';

function AppContent() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createResume" element={<NewResume />} />
          <Route path="/createAiResume" element={<NewAIResume />} />
          <Route path="/:username" element={<Profile />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
}

export default App;