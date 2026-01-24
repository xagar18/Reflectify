import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import Forgot from "./components/Forgot";
import SignIn from "./components/Login";
import SignUp from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import VerifyAccount from "./components/VerifyAccount";
import Home from "./pages/Home";
import OAuthSuccess from "./pages/OAuthSuccess";
import useStore from "./zustand/store";

function App() {
  const { isAuthenticated, getProfile } = useStore();

  if (!isAuthenticated) {
    getProfile();
  }
  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated, getProfile]);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
        />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-account/:token" element={<VerifyAccount />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
