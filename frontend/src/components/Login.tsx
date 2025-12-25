import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { BeatLoader } from "react-spinners";
import useStore from "../zustand/store";

// SignIn component handles user authentication by allowing login with email and password
export default function SignIn() {
  // State variables to manage form inputs and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { auth } = useStore(); // Access auth function from Zustand store to update user state

  // Debug logs for email and password (consider removing in production)
  console.log(email);
  console.log(password);

  // Function to handle login process
  const handleLogin = async () => {
    try {
      setLoading(true); // Set loading to true to show spinner
      // Make POST request to backend login endpoint with credentials
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true } // Include cookies for authentication
      );
      toast.success("Login successful!"); // Show success notification
      console.log("output", response.data.user); // Log user data for debugging
      auth(response.data.user); // Update global state with logged-in user data
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error("Login failed", error); // Log error for debugging
      toast.error("Login failed. Please try again."); // Show error notification
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <>
      {/* Main container for the login form, centered on the page */}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Header text for the sign-in form */}
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Email input field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                onChange={e => {
                  setEmail(e.target.value); // Update email state on input change
                }}
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Password input field with forgot password link */}
          <div>
            <div className="mt-8 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  onClick={() => {
                    navigate("/forgot-password"); // Navigate to forgot password page
                  }}
                  className="font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                onChange={e => {
                  setPassword(e.target.value); // Update password state on input change
                }}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Sign In button with loading spinner */}
          <div>
            <button
              onClick={handleLogin} // Trigger login on button click
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {loading ? (
                <BeatLoader size={8} margin={6} color="white" /> // Show loading spinner when processing
              ) : (
                "Sign In" // Default button text
              )}
            </button>
          </div>

          {/* Link to register page for new users */}
          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Don't have an account{" "}
            <a
              className="font-semibold text-indigo-400 hover:text-indigo-300"
              onClick={() => {
                navigate("/register"); // Navigate to registration page
              }}
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
