import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 relative">
      {/* Animated 404 Image */}
      <div className="absolute inset-0 flex justify-center items-center opacity-20">
        <img src="/assets/404-animation.svg" alt="404 animation" className="w-2/3 md:w-1/3 h-auto" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center p-8 bg-white bg-opacity-90 rounded-lg shadow-2xl transform transition duration-500 hover:scale-105">
        <h1 className="text-8xl font-extrabold text-gray-800 mb-4 drop-shadow-lg">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Oops! Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-6">
          The page you're looking for might have been moved or deleted.
        </p>
        <Link to="/" className="mt-4 px-8 py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-green-400 duration-300">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
