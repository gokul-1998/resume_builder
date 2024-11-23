import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate(); // React Router's hook for navigation

  const handleLogout = () => {
    // Add any logout logic here if necessary
    navigate('/login'); // Navigate back to the login page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          This is your personalized dashboard. Here you can manage your resume, view statistics, and more.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Add more content or functionality to enhance your dashboard.
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 px-8 py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-green-400 duration-300"
        >
          Go Back to Login
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
