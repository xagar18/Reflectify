import axios from "axios";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import * as dotenv from "dotenv";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../prisma-client.js";
import mailService from "../services/mailservice.js";

dotenv.config();

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// register new user
export const registerUser = async (req: Request, res: Response) => {
  if (req.user) {
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Login Successful.",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        },
      });
    }
  }
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("Data is missing.");
    return res.status(400).json({
      success: false,
      message: "All Fields are required!",
    });
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log(verificationToken);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verificationToken,
      },
    });
    if (newUser) {
      console.log("User Registered Successfully.");

      const verifyUrl = `${process.env.FRONTEND_URL}/verify-account/${verificationToken}`;
      mailService(
        newUser.email,
        "Welcome to Reflectify - Verify Your Account",
        `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0f0f0f;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10b981; font-size: 28px; margin: 0;">Reflectify</h1>
            <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Your AI Companion for Self-Reflection</p>
          </div>
          <div style="background-color: #1a1a1a; border-radius: 12px; padding: 30px; border: 1px solid #2a2a2a;">
            <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 15px 0;">Welcome aboard! 👋</h2>
            <p style="color: #9ca3af; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">Thank you for signing up. Please verify your email address to get started with your self-reflection journey.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 16px;">Verify My Account</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin: 25px 0 0 0;">Or copy this link:</p>
            <p style="color: #10b981; font-size: 13px; word-break: break-all; background-color: #0f0f0f; padding: 12px; border-radius: 6px; margin-top: 8px;">${verifyUrl}</p>
          </div>
          <p style="color: #4b5563; font-size: 12px; text-align: center; margin-top: 30px;">If you didn't create this account, you can safely ignore this email.</p>
        </div>
        `,
      );
      return res.status(200).json({
        success: true,
        message: "User Registered Successfully.",
        newUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// login
export const loginUser = async (req: Request, res: Response) => {
  console.log("start");

  // if cookie available
  if (req.user) {
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Login Successful.",
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
        },
      });
    }
  }

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Data is missing.");
    return res.status(400).json({
      success: false,
      message: "All Fields are required!",
    });
  }
  try {
    console.log("try");

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist, please register.",
      });
    }

    // checking user is verified or not
    if (!existingUser.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your account.",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }
    console.log("password checked");

    // creating jwt token
    const jwtToken = jwt.sign(
      { id: existingUser.id },
      process.env.JWT_SECRET!,
      {
        expiresIn: "10d",
      },
    );
    console.log(jwtToken);

    console.log("token created");

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Important for cross-origin
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    };

    res.cookie("token", jwtToken, cookieOptions);
    console.log("cookie set");

    return res.status(200).json({
      success: true,
      message: "Login Successful.",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
};

// Google Auth
export const googleAuth = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required.",
    });
  }

  try {
    // First, verify the token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    await client.getTokenInfo(token); // Verify token

    // Get user info from Google
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { id: googleId, email, name, picture } = userInfoResponse.data;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: "", // No password for Google users
          isVerified: true, // Google accounts are verified
        },
      });
    }

    // Create JWT token
    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    };

    res.cookie("token", jwtToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Google authentication failed.",
    });
  }
};

// Github Auth
export const githubRedirect = (req: Request, res: Response) => {
  const url =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}` +
    "&scope=user:email";

  res.redirect(url);
};

export const githubCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ message: "Code missing" });

  try {
    // 1️⃣ Exchange code → access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } },
    );

    const accessToken = tokenRes.data.access_token;

    // 2️⃣ Fetch GitHub profile
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 3️⃣ Fetch email
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email =
      emailRes.data.find((e: any) => e.primary && e.verified)?.email ||
      `${userRes.data.id}@github.local`;

    // 4️⃣ Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: userRes.data.login,
          email,
          password: "",
          isVerified: true,
        },
      });
    }

    // 5️⃣ Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "10d",
    });

    // 6️⃣ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    // 7️⃣ Redirect to frontend
    return res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
  } catch (err) {
    console.error("GitHub Auth Error:", err);
    return res.status(500).json({ message: "GitHub auth failed" });
  }
};

export const profile = async (req: Request, res: Response) => {
  console.log("profile", req.user);
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findFirst({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    console.log("req user : ", req.user);
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now()),
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed, please try again later",
    });
  }
};

//send forgot pass mail
export const forgotPassword = async (req: Request, res: Response) => {
  console.log("forgot");

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const userFound = await prisma.user.findFirst({ where: { email } });
    if (!userFound) {
      return res.status(401).json({
        message: "email is not registered",
      });
    }
    console.log("before token");

    const randomToken = crypto.randomBytes(32).toString("hex");
    console.log(randomToken);
    console.log(userFound.id);

    //save in db
    const userSave = await prisma.user.update({
      where: { id: userFound.id },
      data: {
        passwordResetToken: randomToken,
        passwordResetExpiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    });
    console.log("after save");
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${randomToken}`;
    mailService(
      userSave.email,
      "Reset Your Reflectify Password",
      `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0f0f0f;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981; font-size: 28px; margin: 0;">Reflectify</h1>
          <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Your AI Companion for Self-Reflection</p>
        </div>
        <div style="background-color: #1a1a1a; border-radius: 12px; padding: 30px; border: 1px solid #2a2a2a;">
          <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 15px 0;">Password Reset Request 🔐</h2>
          <p style="color: #9ca3af; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">We received a request to reset your password. Click the button below to create a new password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset Password</a>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin: 25px 0 0 0;">Or copy this link:</p>
          <p style="color: #10b981; font-size: 13px; word-break: break-all; background-color: #0f0f0f; padding: 12px; border-radius: 6px; margin-top: 8px;">${resetUrl}</p>
          <p style="color: #ef4444; font-size: 13px; margin-top: 20px;">⏰ This link expires in 48 hours.</p>
        </div>
        <p style="color: #4b5563; font-size: 12px; text-align: center; margin-top: 30px;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
      </div>
      `,
    );

    if (!userSave) {
      return res.status(404).json({
        message: "internal server error",
      });
    }
    return res.status(200).json({
      message: "reset link sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing forgot password",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { token } = req.params;
  const tokenStr = String(token);

  if (!password) {
    return res.status(401).json({
      message: "password is required",
    });
  }
  try {
    const userFound = await prisma.user.findFirst({
      where: {
        passwordResetToken: tokenStr,
        passwordResetExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!userFound) {
      return res.status(401).json({
        message: "invalid token",
        success: false,
      });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // update the user

    const updatedUser = await prisma.user.update({
      where: { id: userFound.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "db error",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// verification
export const verifyUser = async (req: Request, res: Response) => {
  const { token } = req.params;
  const tokenStr = String(token);

  if (!tokenStr) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: tokenStr },
  });

  if (!user) {
    return res.status(400).json({
      message: "User not found or invalid token",
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
    },
  });

  return res.status(200).json({
    message: "Email verified successfully!",
  });
};
