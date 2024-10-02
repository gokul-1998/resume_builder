import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
// import UserDecks from "./UserDecks";  // Your component for user decks
// import StarredDecks from "./StarredDecks";  // Your component for starred decks
// import SavedCards from "./SavedCards";
// import DecksInReview from "./DecksInReview";
import NotFoundPage from "./NotFoundPage";

const Profile = () => {
  // Get the username from the path
  const { username } = useParams();
  const location = useLocation();  // To get the query parameters
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false); // State to track 404 errors
  const url = `${import.meta.env.VITE_AUTH_BACKEND_URL}`||"http://localhost:8000";  // API base URL

  // Parse the query string to get the 'tab' value
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get('tab');
  console.log(url)

  console.log("Tab:", tab);

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
  }, [username]);

  // Get current user from Redux store
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
    return <NotFoundPage />;  // Show 404 page if user not found
  }

  // Conditionally render based on the 'tab' query parameter
  return (
    <>
      {tab === "decks" ? (
        <UserDecks />  // Render user decks if tab=decks
      ) : tab === "stars" ? (
        <StarredDecks />  // Render starred decks if tab=stars
      ) :
       tab==="saved-cards"?(
        <SavedCards/>
       )
        :
        tab==='in-review'?(
          <DecksInReview/>
        )
        :
      
      (
    
        
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "left", marginBottom: "20px" }}>
        <span
          style={{
            color: "white",
            fontWeight: "bold",
            backgroundColor: "green",
            padding: "5px",
            borderRadius: "5px",
            textTransform: "capitalize",
          }}
        >
          {user}'s 
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
        <p>
          <strong>Username:</strong> {user?.username || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "N/A"}
        </p>
        <p>
          <strong>Full Name:</strong> {user?.fullName || "N/A"}
        </p>
        {/* Add other user details here */}
      </div>

      {/* Conditionally render based on the 'tab' value */}
      
    </div>
        )}
        </>
  );
    

  
  
};

export default Profile;
