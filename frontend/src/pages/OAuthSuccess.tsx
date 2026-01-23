// handles the redirect back from GitHub. It fetches the user profile (using the cookie set by the backend) and redirects to home page.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import useStore from "../zustand/store";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { getProfile } = useStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await getProfile();
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 500);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        navigate("/login", { replace: true });
      }
    };

    fetchProfile();
  }, [getProfile, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <BeatLoader size={15} margin={8} color="#10b981" />
        <p className="mt-4 text-lg text-gray-300">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
