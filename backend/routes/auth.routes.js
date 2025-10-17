import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const useRouter = express.Router();

useRouter.post("/register", registerUser);
useRouter.get("/login", loginUser);

export default useRouter;
