import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="relative z-10 text-center p-10 bg-white rounded-lg shadow-lg animate-slow-zoom">
        {/* Welcome Box */}
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
          Welcome to the <span className="text-teal-500">Resume Builder</span>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-700 mb-4 leading-relaxed">
          Effortlessly create a professional resume with our intuitive web application, built with 
          <span className="font-semibold text-teal-500"> React </span> and 
          <span className="font-semibold text-teal-500"> FastAPI</span>. Showcase your skills, experience, and achievements in just a few clicks.
        </p>

        <p className="text-xl text-gray-700 mb-4 leading-relaxed">
          Build, save, and manage multiple resumes tailored to your career goals. Experience the simplicity of creating standout documents.
        </p>

        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          Let's get started on your journey to success!
        </p>

        {/* Call-to-Action Button */}
        <Link to="/login" className="inline-block px-8 py-4 bg-teal-500 text-white font-semibold rounded-full shadow-md hover:bg-teal-600 transition duration-300 transform hover:scale-105">
          Build Your Resume Now
        </Link>
      </div>

      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-400 to-blue-500 opacity-40"></div>
    </div>
  );
};

export default Home;
