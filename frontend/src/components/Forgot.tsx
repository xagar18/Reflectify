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
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@gmail\.com$/;

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
    <div className="flex min-h-screen bg-gray-950">
      {/* Left side - Branding (hidden on mobile) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-12 lg:flex lg:w-1/2">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 h-full w-full opacity-10">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-white">
            🌱 Reflectify
          </h1>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl leading-tight font-bold text-white">
            Don't worry,
            <br />
            we've got you covered
          </h2>
          <p className="max-w-md text-lg text-emerald-100">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="relative z-10 text-sm text-emerald-200">
          © 2026 Reflectify. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
              🌱 Reflectify
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-white">
              Forgot password?
            </h2>
            <p className="text-gray-400">
              No worries, we'll send you reset instructions
            </p>
          </div>

          <div className="space-y-4">
            {/* Email input */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={e => {
                  const value = e.target.value;
                  setEmail(value);
                  if (value && !emailRegex.test(value)) {
                    setEmailError("Email must be a valid Gmail address.");
                  } else {
                    setEmailError("");
                  }
                }}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={handleForgot}
              disabled={loading || !!emailError || !email}
              className="mt-2 w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <BeatLoader size={8} margin={6} color="white" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>

          {/* Back to login link */}
          <p className="mt-8 text-center text-gray-400">
            Remember your password?{" "}
            <span
              className="cursor-pointer font-medium text-emerald-400 hover:text-emerald-300"
              onClick={() => navigate("/login")}
            >
              Back to login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
