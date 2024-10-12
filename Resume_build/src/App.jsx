import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import { checkAuth } from './features/auth/authSlice';
import RegisterPage from './pages/register-page';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { Toaster } from "@/components/ui/toaster";
import NotFound from './pages/NotFound';
// import { RootState } from './app/store';
import ResumeForm from './components/ResumeForm1.jsx';

import Resume from './components/resume1.jsx';
import PrintButton from './components/PrintButton.jsx';
import data from './resumeData1.json';
import Home from './Pages/Home.jsx';

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppContent() {
  const [count, setCount] = useState(0);
  const storedData = JSON.parse(localStorage.getItem("resumeFormData"));

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
            <div className="App">

      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
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
        
        <Route 
          path="*" 
         element= {<NotFound/>} 
        />
      </Routes>
      <Toaster />
      </div>
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