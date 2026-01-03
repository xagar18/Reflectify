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
            Welcome back to
            <br />
            your safe space
          </h2>
          <p className="max-w-md text-lg text-emerald-100">
            Continue your journey of self-discovery and mindful reflection.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2 text-emerald-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">
                ✓
              </span>
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">
                ✓
              </span>
              <span>AI-Powered</span>
            </div>
          </div>
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
            <h2 className="mb-2 text-3xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-400">Sign in to continue reflecting</p>
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
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Password input */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="cursor-pointer text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Forgot password?
                </span>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <BeatLoader size={8} margin={6} color="white" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-gray-400">
            Don't have an account?{" "}
            <span
              className="cursor-pointer font-medium text-emerald-400 hover:text-emerald-300"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
