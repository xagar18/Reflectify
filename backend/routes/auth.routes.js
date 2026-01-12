import express from "express";
import {
  forgotPassword,
  googleAuth,
  loginUser,
  logoutUser,
  profile,
  registerUser,
  resetPassword,
  verifyUser,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const useRouter = express.Router();

useRouter.post("/register", isLoggedIn, registerUser);
useRouter.post("/login", isLoggedIn, loginUser);
useRouter.post("/google-auth", googleAuth);
useRouter.get("/profile", isLoggedIn, profile);
useRouter.post("/logout", logoutUser);
useRouter.post("/frgt", forgotPassword);
useRouter.post("/res/:token", resetPassword);
useRouter.get("/verify/:token", verifyUser);

export default useRouter;
