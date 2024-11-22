import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import ResumeForm from "./ResumeForm2";
import Resume from "./resume1";
import PrintButton from "./PrintButton";
import ProfileResume from "./ProfileResume";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  const handleTabChange = (value) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(location.search);
    newParams.set("tab", value);
    window.history.pushState({}, "", `${location.pathname}?${newParams.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{user.name}'s Profile</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          {resumeData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">About Me</h2>
                  <p>{resumeData.aboutMe}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  {resumeData.contact?.map((contact, index) => (
                    <div key={index} className="mb-2">
                      <strong>{contact.type}:</strong> {contact.value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>
                  {Object.entries(resumeData.skills || {}).map(([category, skills]) => (
                    <div key={category} className="mb-4">
                      <h3 className="font-medium mb-2">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.interests?.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resume">
          <ProfileResume username={username} />
        </TabsContent>
      </Tabs>
    </div>
  );
}