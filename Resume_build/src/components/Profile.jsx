import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import ResumeForm from "./ResumeForm2";
import Resume from "./resume1";
import PrintButton from "./PrintButton";
import ProfileResume from "./ProfileResume";
import ProfileForm from "./ProfileForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

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
    const token = localStorage.getItem('token');
    fetch(`${url}/api/auth/user/${username}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        if (res.status === 401) {
          window.location.href = '/login';
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

  if (notFound) {
    return <NotFoundPage />;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(location.search);
    newParams.set("tab", value);
    window.history.pushState({}, "", `${location.pathname}?${newParams.toString()}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileForm user={user} onProfileUpdate={handleProfileUpdate} />
        </TabsContent>

        <TabsContent value="resume" className="space-y-6">
          <ProfileResume username={username} />
        </TabsContent>
      </Tabs>
    </div>
  );
}