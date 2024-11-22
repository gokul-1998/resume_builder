import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

// Debounce function to limit the number of API calls during typing
function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default function SignUpPage() {
  const [formData, setFormData] = useState({ 
    username: "", 
    profile_name: "", 
    email: "", 
    password: "" 
  });
  const [nameError, setNameError] = useState("");
  const [nameAvailable, setNameAvailable] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset availability states when field is empty
    if (value.trim() === "") {
      if (name === "profile_name") {
        setNameAvailable(false);
        setNameError("");
      } else if (name === "username") {
        setUsernameAvailable(false);
        setUsernameError("");
      } else if (name === "email") {
        setEmailAvailable(false);
        setEmailError("");
      }
      return;
    }

    if (name === "profile_name" && value.trim().length >= 3) {
      debouncedCheckNameAvailability(value);
    } else if (name === "username" && value.trim().length >= 3) {
      debouncedCheckUsernameAvailability(value);
    } else if (name === "email" && value.includes("@")) {
      debouncedCheckEmailAvailability(value);
    }
  };

  const debouncedCheckNameAvailability = debounce(async (name) => {
    if (!name.trim()) return;
    setNameError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/api/auth/check-name/${encodeURIComponent(name)}`
      );
      const data = await response.json();

      if (response.status === 409) {
        setNameError(data.detail || "Display name is already taken");
        setNameAvailable(false);
      } else if (response.ok) {
        setNameAvailable(true);
      } else {
        throw new Error(data.detail || "Error checking display name availability");
      }
    } catch (err) {
      setNameError(err.message || "Error checking display name availability");
      setNameAvailable(false);
    }
  }, 500);

  const debouncedCheckUsernameAvailability = debounce(async (username) => {
    if (!username.trim()) return;
    setUsernameError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/api/auth/check-username/${encodeURIComponent(username)}`
      );
      const data = await response.json();

      if (response.status === 409) {
        setUsernameError(data.detail || "Username is already taken");
        setUsernameAvailable(false);
      } else if (response.ok) {
        setUsernameAvailable(true);
      } else {
        throw new Error(data.detail || "Error checking username availability");
      }
    } catch (err) {
      setUsernameError(err.message || "Error checking username availability");
      setUsernameAvailable(false);
    }
  }, 500);

  const debouncedCheckEmailAvailability = debounce(async (email) => {
    if (!email.trim() || !email.includes("@")) return;
    setEmailError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_AUTH_BACKEND_URL}/api/auth/check-email/${encodeURIComponent(email)}`
      );
      const data = await response.json();

      if (response.status === 409) {
        setEmailError(data.detail || "Email is already registered");
        setEmailAvailable(false);
      } else if (response.ok) {
        setEmailAvailable(true);
      } else {
        throw new Error(data.detail || "Error checking email availability");
      }
    } catch (err) {
      setEmailError(err.message || "Error checking email availability");
      setEmailAvailable(false);
    }
  }, 500);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!formData.username.trim() || !formData.profile_name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All fields are required");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_BACKEND_URL}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Sign up failed. Please try again.");
      }

      setSuccess(true);
      setFormData({ username: "", profile_name: "", email: "", password: "" });

      // Show success message and redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-gray-500">Enter your details to register</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={usernameError ? "border-red-500" : usernameAvailable && formData.username ? "border-green-500" : "border-gray-300"}
            />
            {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
            {usernameAvailable && formData.username && <p className="text-sm text-green-500">Username is available!</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile_name">Display Name</Label>
            <Input
              id="profile_name"
              name="profile_name"
              type="text"
              value={formData.profile_name}
              onChange={handleChange}
              placeholder="Enter your display name"
              className={nameError ? "border-red-500" : nameAvailable && formData.profile_name ? "border-green-500" : "border-gray-300"}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
            {nameAvailable && formData.profile_name && <p className="text-sm text-green-500">Display name is available!</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={emailError ? "border-red-500" : emailAvailable && formData.email ? "border-green-500" : "border-gray-300"}
            />
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            {emailAvailable && formData.email && <p className="text-sm text-green-500">Email is available!</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <p className="text-gray-500 text-sm">Must be at least 6 characters</p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>Account created successfully! Redirecting to login...</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
