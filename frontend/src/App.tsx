import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Forgot from "./components/Forgot";
import SignIn from "./components/Login";
import SignUp from "./components/Register";
import ResetPassword from "./components/ResestPassword";
import VerifyAccount from "./components/VefiryAccount";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-account/:token" element={<VerifyAccount />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
