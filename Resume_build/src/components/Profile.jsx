import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import ResumeForm from "./ResumeForm2";
import Resume from "./resume1";
import PrintButton from "./PrintButton";

export default function Profile() {
  const { username } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}` || "http://localhost:8000";
  const [resumeData, setResumeData] = useState(null);
  const [activeTab, setActiveTab] = useState(new URLSearchParams(location.search).get("tab") || "profile");

  const queryParams = new URLSearchParams(location.search);
  
  useEffect(() => {
    if (user?.profile) {
      try {
        const parsedProfile = JSON.parse(user.profile);
        setResumeData(parsedProfile.profile);
        localStorage.setItem("resumeData", JSON.stringify(parsedProfile.profile));
      } catch (error) {
        console.error("Error parsing JSON profile", error);
      }
    }
  }, [user]);

  useEffect(() => {
    fetch(`${url}/api/auth/user/${username}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        setNotFound(false);
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false);
      });
  }, [username, url]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
            <span className="text-sm text-gray-600">
              Joined {new Date(user?.created_at).toLocaleDateString()}
            </span>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-4 border-b">
            <button
              className={`py-2 px-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'resume' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
              onClick={() => setActiveTab('resume')}
            >
              Resume
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Contact</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              {user?.profile && Object.keys(JSON.parse(user.profile)).length > 0 && (
                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2">Profile Information</h2>
                  <div className="space-y-2">
                    {Object.entries(JSON.parse(user.profile)).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="font-medium text-gray-700 w-1/3 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'resume' && resumeData && (
            <div>
              <div className="flex justify-end mb-4">
                <PrintButton />
              </div>
              <Resume resumeData={resumeData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}