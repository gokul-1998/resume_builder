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
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [nameError, setNameError] = useState("");
  const [nameAvailable, setNameAvailable] = useState(false);
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
      if (name === "name") {
        setNameAvailable(false);
        setNameError("");
      } else if (name === "email") {
        setEmailAvailable(false);
        setEmailError("");
      }
      return;
    }

    if (name === "name" && value.trim().length >= 3) {
      debouncedCheckNameAvailability(value);
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
        setNameError(data.detail || "Username is already taken");
        setNameAvailable(false);
      } else if (response.ok) {
        setNameAvailable(true);
      } else {
        throw new Error(data.detail || "Error checking username availability");
      }
    } catch (err) {
      setNameError(err.message || "Error checking username availability");
      setNameAvailable(false);
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
    setSuccess(false);

    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
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
      setFormData({ name: "", email: "", password: "" });

      // Show success message and redirect
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign up for Resume Builder</h2>
          {success && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Registration successful! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Choose a username"
                value={formData.name}
                onChange={handleChange}
                className={`${
                  nameError ? "border-red-500" : nameAvailable && formData.name ? "border-green-500" : "border-gray-300"
                } mt-1`}
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
              {nameAvailable && formData.name && (
                <p className="text-green-500 text-sm mt-1">Username is available</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`${
                  emailError ? "border-red-500" : emailAvailable && formData.email ? "border-green-500" : "border-gray-300"
                } mt-1`}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
              {emailAvailable && formData.email && (
                <p className="text-green-500 text-sm mt-1">Email is available</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
              />
              <p className="text-gray-500 text-sm mt-1">Must be at least 6 characters</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}
