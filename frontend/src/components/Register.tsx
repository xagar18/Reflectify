import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import useStore from "../zustand/store";

// SignUp component handles user registration by collecting name, email, and password
export default function SignUp() {
  // State variables to manage form inputs and loading state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // States for visibility and validation errors
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();
  const { auth } = useStore();

  const googleLogin = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async tokenResponse => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/google-auth`,
          { token: tokenResponse.access_token },
          { withCredentials: true }
        );
        toast.success("Signed up with Google!");
        console.log("Google auth response", response.data);
        await auth(response.data.user);
        navigate("/");
      } catch (error) {
        console.error("Google auth failed", error);
        toast.error("Google authentication failed. Please try again.");
      }
    },
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/github`;
  };

  const emailRegex = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@gmail\.com$/;

  // Password validation checks
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const noThreeConsecutive = !/(.)\1\1/.test(password);
  const isPasswordValid =
    password.length >= 8 &&
    hasLower &&
    hasUpper &&
    hasNumber &&
    hasSpecial &&
    noThreeConsecutive;

  // Validation handlers
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !emailRegex.test(value)) {
      setEmailError(
        "Sorry, only letters (a-z), numbers (0-9), and periods (.) are allowed."
      );
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // Debug logs for form inputs (consider removing in production)
  console.log(email);
  console.log(password);
  console.log(name);

  // Function to handle user registration process
  const handleRegister = async () => {
    try {
      setLoading(true); // Set loading to true to show spinner
      // Make POST request to backend registration endpoint with user data
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true } // Include cookies for authentication
      );
      toast.success("Registration successful!"); // Show success notification
      console.log("output", response); // Log response for debugging
      navigate("/"); // Redirect to home page after successful registration
    } catch (error) {
      console.error("Registration failed", error); // Log error for debugging
      toast.error("Registration failed. Please try again."); // Show error notification
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-950">
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
            Start your journey of
            <br />
            self-reflection today
          </h2>
          <p className="max-w-md text-lg text-indigo-100">
            A safe, private space to explore your thoughts, understand your
            emotions, and grow as a person.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="flex items-center gap-2 text-indigo-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">
                ✓
              </span>
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm">
                ✓
              </span>
              <span>AI-Powered</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-indigo-200">
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
              Create account
            </h2>
            <p className="text-gray-400">Begin your reflection journey</p>
          </div>

          <div className="space-y-4">
            {/* Name input */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                placeholder="Your Name"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

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
                onChange={handleEmailChange}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>

            {/* Password input */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 pr-12 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-3 rounded-xl p-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${password.length >= 8 ? "bg-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
                      >
                        {password.length >= 8 ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-green-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-gray-300">
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${hasLower ? "bg-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
                      >
                        {hasLower ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-green-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-gray-300">
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${hasUpper ? "bg-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
                      >
                        {hasUpper ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-green-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-gray-300">
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${hasNumber ? "bg-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
                      >
                        {hasNumber ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-green-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-gray-300">One number</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${hasSpecial ? "bg-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
                      >
                        {hasSpecial ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-green-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-gray-300">
                        One special character
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${noThreeConsecutive ? "bg-green-500/20 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
                      >
                        {noThreeConsecutive ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-green-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-red-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-gray-300">
                        No 3 consecutive chars
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={handleRegister}
              disabled={
                loading ||
                !!emailError ||
                !isPasswordValid ||
                !name ||
                !email ||
                !password
              }
              className="mt-2 w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <BeatLoader size={8} margin={6} color="white" />
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-900 px-4 text-gray-400">or</span>
              </div>
            </div>

            {/* Social Auth Buttons */}
            <div className="mt-6 flex gap-3">
              {/* Google Auth Button */}
              <button
                onClick={() => googleLogin()}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-lg hover:shadow-gray-400/30 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none active:translate-y-0 active:scale-[0.98]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              {/* GitHub Auth Button */}
              <button
                onClick={handleGithubLogin}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-800 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-700 hover:shadow-lg hover:shadow-gray-400/30 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none active:translate-y-0 active:scale-[0.98]"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>
          </div>

          {/* Sign in link */}
          <p className="mt-8 text-center text-gray-400">
            Already have an account?{" "}
            <span
              className="cursor-pointer font-medium text-emerald-600 hover:text-emerald-500"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
