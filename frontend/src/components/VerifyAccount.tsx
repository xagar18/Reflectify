import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

// VerifyAccount component handles email verification using a token from the URL
export default function VerifyAccount() {
  // State variable to manage loading state
  const [loading, setLoading] = useState(false);

  // Extract token from URL parameters
  const { token } = useParams();

  const navigate = useNavigate();

  // Function to handle account verification process
  const handleVerifyAccount = async () => {
    try {
      setLoading(true); // Set loading to true to show spinner
      // Make GET request to backend verification endpoint with token
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/verify/${token}`,
        { withCredentials: true } // Include cookies for authentication
      );
      console.log("output", response); // Log response for debugging
      toast.success("Account verified successfully!"); // Show success notification
      navigate("/login"); // Redirect to login page after successful verification
    } catch (error) {
      console.error("Verification failed", error); // Log error for debugging
      toast.error("Account verification failed. Please try again."); // Show error notification
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <>
      {/* Main container for the verification form, centered on the page */}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Header text for the verification form */}
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Verify your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Verify Account button with loading spinner */}
          <div>
            <button
              onClick={handleVerifyAccount} // Trigger verification on button click
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {loading ? (
                <BeatLoader size={8} margin={6} color="white" /> // Show loading spinner when processing
              ) : (
                "Verify Account" // Default button text
              )}
            </button>
          </div>

          {/* Link to login page for already verified users */}
          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Already verified?{" "}
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
