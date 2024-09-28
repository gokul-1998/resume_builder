// NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-6">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
