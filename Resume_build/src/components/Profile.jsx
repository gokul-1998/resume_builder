import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get("tab");
  
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
    fetch(`${url}/users/${username}`)
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
  
  const userFromRedux = useSelector((state) => state.user);
  const [profilePicture, setProfilePicture] = useState(
    userFromRedux?.profilePicture || ""
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        // Here you would typically upload the file to your server
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        {/* User profile details */}
        <h1 style={{ textAlign: "left", marginBottom: "20px" }}>
          <span style={{
            color: "white",
            fontWeight: "bold",
            backgroundColor: "green",
            padding: "5px",
            borderRadius: "5px",
            textTransform: "capitalize",
          }}>
            {user?.name || username}'s
          </span>
          &nbsp;&nbsp; Profile
        </h1>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            style={{
              borderRadius: "50%",
              width: "150px",
              height: "150px",
              objectFit: "cover",
              border: "2px solid #ddd",
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <h3>User Details</h3>
          <p><strong>Username:</strong> {user?.name || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Joined:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
        </div>
      </div>
     
      <div className="App">
        <div className="flex flex-row h-screen">
          {/* Resume on the left */}
          <div className="w-1/2 bg-gray-100 p-4">
            <Resume resumeData={resumeData}/>
          </div>

          {/* Form on the right, hidden during print */}
          <div className="w-1/2 bg-white p-4 hide-on-print">
            <ResumeForm initialResumeData={resumeData} setResumeData={setResumeData} />    
          </div>
        </div>
        <PrintButton />
      </div>
    </>
  );
}