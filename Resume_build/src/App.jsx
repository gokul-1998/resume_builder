import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // Import any necessary styles
import { checkAuth } from './features/auth/authSlice';
import { store } from './app/store';
import { Provider, useDispatch, useSelector } from 'react-redux';

import Home from './Pages/Home.jsx'; // Home component
import SignUpPage from './Pages/signup.jsx'; // SignUp component
import LoginPage from './Pages/loginPage.jsx'; // LoginPage component
import NotFoundPage from './components/NotFoundPage.jsx'; // 404 Page
import Dashboard from './components/dashboard.jsx'; // Dashboard component
import Navbar from './components/NavBar.jsx'; // Navbar component
import Profile from './components/Profile'; // Profile component
import PrivateRoute from './components/PrivateRoute.jsx';



function AppContent() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth()); // Dispatch to check if user is authenticated
  }, [dispatch]);

  return (
    <Router>
      <Navbar /> {/* Display the Navbar on all pages */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} /> 
        <Route element={<PrivateRoute />}>

        <Route path="/dashboard" element={<Dashboard />} /> {/* Protect dashboard route */}
        <Route path="/" element={<Home />} />
        <Route path="/:username" element={ <Profile />} /> 
        </Route>

        


        {/* Protect Home route */}

        {/* Catch all other routes - 404 Page */}
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