import React from 'react';

const Home = () => {
  return (
    <section className="home-section bg-gray-100 py-12">
      <div className="intro-container max-w-4xl mx-auto text-center px-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Welcome to the Resume Builder
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          The Resume Builder is a user-friendly web application designed to help individuals create
          professional resumes effortlessly. Built using React for the frontend and FastAPI for the backend,
          this project enables users to register, log in, and build customized resumes by filling out
          relevant details such as personal information, work experience, education, and skills. With an intuitive
          interface and the ability to save and manage multiple resumes, it simplifies the process of creating
          polished, job-ready documents in minutes.
        </p>
        <p className="text-lg text-gray-600">
          Explore the features, craft your resume, and get a professional document that highlights your skills and achievements!
        </p>
      </div>
    </section>
  );
};

export default Home;
