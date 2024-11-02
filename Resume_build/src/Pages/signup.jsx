import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";

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
  const [emailError, setEmailError] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      debouncedCheckEmailAvailability(value);
    }
  };

  const debouncedCheckEmailAvailability = debounce(async (email) => {
    setEmailError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_BACKEND_URL}/users/check/${email}`);

      if (response.status === 409) {
        setEmailError("Email is already taken. Please use another.");
        setEmailAvailable(false);
      } else if (response.ok) {
        setEmailAvailable(true);
      } else {
        throw new Error("Error checking email availability.");
      }
    } catch {
      setEmailError("Error checking email availability. Please try again.");
      setEmailAvailable(false);
    }
  }, 500);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!emailAvailable) {
      setError("Please use a different email.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_BACKEND_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Sign up failed. Please try again.");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign up for Resume Builder</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Label htmlFor="name" className="sr-only">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="email" className="sr-only">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className={`${emailError ? "border-red-500" : "border-gray-300"} appearance-none rounded-md w-full px-3 py-2`}
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="sr-only">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : "Sign up"}
            </Button>
          </div>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your account has been created successfully!</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
