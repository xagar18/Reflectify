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

  const navigate = useNavigate();

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
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Confirm Password input */}
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white transition-colors outline-none placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleResetPassword}
              disabled={loading}
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
