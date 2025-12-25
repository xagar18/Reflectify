import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

// SignUp component handles user registration by collecting name, email, and password
export default function SignUp() {
  // State variables to manage form inputs and loading state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    <>
      {/* Main container for the registration form, centered on the page */}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Header text for the sign-up form */}
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign Up to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Name input field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Full Name
            </label>
            <div className="mt-2 mb-6">
              <input
                id="name"
                name="name"
                type="text"
                required
                onChange={e => {
                  setName(e.target.value); // Update name state on input change
                }}
                autoComplete="name"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

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

          {/* Password input field */}
          <div>
            <div className="mt-6 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Password
              </label>
              <div className="text-sm"></div>
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

          {/* Sign Up button with loading spinner */}
          <div>
            <button
              onClick={handleRegister} // Trigger registration on button click
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {loading ? (
                <BeatLoader size={8} margin={6} color="white" /> // Show loading spinner when processing
              ) : (
                "Sign Up" // Default button text
              )}
            </button>
          </div>

          {/* Link to login page for existing users */}
          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Already have an Account?{" "}
            <span
              className="font-semibold text-indigo-400 hover:text-indigo-300"
              onClick={() => {
                navigate("/login"); // Navigate to login page
              }}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
