import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function VerifyAccount() {
  const { token } = useParams();

  const navigate = useNavigate();

  const handleVerifyAccount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/user/verify/${token}`,
        { withCredentials: true }
      );
      console.log("output", response);
      toast.success("Account verified successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Verification failed", error);
      toast.error("Account verification failed. Please try again.");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Verify your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <form method="POST" className="space-y-6"> */}

          <div>
            <button
              onClick={handleVerifyAccount}
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Activate account
            </button>
          </div>
          {/* </form> */}

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Already verified?{" "}
            <a
              className="font-semibold text-indigo-400 hover:text-indigo-300"
              onClick={() => {
                navigate("/login");
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
