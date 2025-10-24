import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Forgot() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  console.log(email);

  const handleForgot = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/frgt",
        {
          email,
        },
        { withCredentials: true }
      );
      console.log("output", response);
    } catch (error) {}
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Recover your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <form method="POST" className="space-y-6"> */}
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
                  setEmail(e.target.value);
                }}
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleForgot}
              className="mt-6 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Send reset link
            </button>
          </div>
          {/* </form> */}

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Remembered your password?{" "}
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
