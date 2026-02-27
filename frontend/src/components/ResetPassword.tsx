import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // States for visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Password validation checks
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-={}';:\\|,.<>?"]/.test(password);
  const noThreeConsecutive = !/(.)\1\1/.test(password);
  const isPasswordValid =
    password.length >= 8 &&
    hasLower &&
    hasUpper &&
    hasNumber &&
    hasSpecial &&
    noThreeConsecutive;

  console.log(password);

  const handleResetPassword = async () => {
    if (confirmPassword != password) {
      toast.error("Passwords do not match!");
      return;
    }
    console.log(token);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/res/${token}`,
        { password },
        { withCredentials: true }
      );

      console.log("output", response);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Reset failed", error);
      toast.error("Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Left side - Branding (hidden on mobile) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700 p-12 lg:flex lg:w-1/2">
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
            Almost there!
            <br />
            Create a new password
          </h2>
          <p className="max-w-md text-lg text-emerald-100">
            Choose a strong password to keep your reflections safe and secure.
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
              Reset password
            </h2>
            <p className="text-gray-400">Enter your new password below</p>
          </div>

          <div className="space-y-4">
            {/* Password input */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 pr-12 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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

            {/* Confirm Password input */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 pr-12 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? (
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
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={handleResetPassword}
              disabled={
                loading ||
                !isPasswordValid ||
                !confirmPassword ||
                password !== confirmPassword
              }
              className="mt-2 w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <BeatLoader size={8} margin={6} color="white" />
              ) : (
                "Reset Password"
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
