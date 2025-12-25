import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

// Forgot component handles password reset by sending a reset link to the user's email
export default function Forgot() {
  // State variables to manage email input and loading state
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Debug log for email (consider removing in production)
  console.log(email);

  // Function to handle forgot password process
  const handleForgot = async () => {
    try {
      setLoading(true); // Set loading to true to show spinner
      // Make POST request to backend forgot password endpoint with email
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/frgt`,
        {
          email,
        },
        { withCredentials: true } // Include cookies for authentication
      );
      console.log("output", response); // Log response for debugging
      toast.success("Password reset link sent to your email!"); // Show success notification
      navigate("/login"); // Redirect to login page after sending reset link
    } catch (error) {
      console.error("There was an error!", error); // Log error for debugging
      toast.error("Failed to send reset link. Please try again."); // Show error notification
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <>
      {/* Main container for the forgot password form, centered on the page */}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Header text for the forgot password form */}
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Recover your account
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

          {/* Send Reset Link button with loading spinner */}
          <div>
            <button
              onClick={handleForgot} // Trigger forgot password on button click
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {loading ? (
                <BeatLoader size={8} margin={6} color="white" /> // Show loading spinner when processing
              ) : (
                "Send Reset Link" // Default button text
              )}
            </button>
          </div>

          {/* Link to login page for users who remember their password */}
          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Remembered your password?{" "}
            <a
              className="font-semibold text-indigo-400 hover:text-indigo-300"
              onClick={() => {
                navigate("/login"); // Navigate to login page
              }}
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
