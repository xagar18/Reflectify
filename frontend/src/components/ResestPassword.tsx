import axios from "axios";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  console.log(password);

  const handleResetPassword = async () => {
    if (confirmPassword != password) {
      toast.error("Passwords do not match!");
      return;
    }
    console.log(token);

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/user/res/${token}`,
        { password },
        { withCredentials: true }
      );

      console.log("output", response);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Reset failed", error);
      toast.error("Password reset failed. Please try again.");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Reset your password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <form method="POST" className="space-y-6"> */}

          <div>
            <div className="mt-8 flex items-center justify-between">
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
                  setPassword(e.target.value);
                }}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="mt-8 flex items-center justify-between">
              <label
                htmlFor="confirm-password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Confirm Password
              </label>
              <div className="text-sm"></div>
            </div>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                onChange={e => {
                  setConfirmPassword(e.target.value);
                }}
                autoComplete="current-password"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleResetPassword}
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Update password
            </button>
          </div>
          {/* </form> */}
        </div>
      </div>
    </>
  );
}
