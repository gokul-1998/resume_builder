import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}` || "http://localhost:8000";

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      // Try to get user profile with current token
      const response = await fetch(`${url}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 && refreshToken) {
        // Token expired, try to refresh
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Retry with new token
          const retryResponse = await fetch(`${url}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${newToken}`
            }
          });
          if (retryResponse.ok) {
            const userData = await retryResponse.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            handleLogout();
          }
        } else {
          handleLogout();
        }
      } else if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await fetch(`${url}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (response.ok) {
        const { access_token } = await response.json();
        localStorage.setItem('token', access_token);
        return access_token;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };

  const handleLogin = async (userData) => {
    if (userData?.token) {
      localStorage.setItem('token', userData.token);
      if (userData.refresh_token) {
        localStorage.setItem('refreshToken', userData.refresh_token);
      }
    }
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      handleLogin,
      handleLogout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
