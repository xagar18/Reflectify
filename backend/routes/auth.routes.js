import express from "express";
import { forgotPassword, loginUser, logoutUser, profile, registerUser, resetPassword } from "../controllers/auth.controller.js";
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const useRouter = express.Router();

useRouter.post("/register",isLoggedIn, registerUser);
useRouter.post("/login",isLoggedIn, loginUser);
useRouter.get("/profile",isLoggedIn,profile)
useRouter.post("/logout", logoutUser);
useRouter.post("/frgt", forgotPassword);
useRouter.post('/res/:token',resetPassword)


export default useRouter;
