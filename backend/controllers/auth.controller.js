import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenev from "dotenv";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import mailService from "../services/mailservice.js";

dotenev.config();

// register new user
export const registerUser = async (req, res) => {
  if (req.user) {
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
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

      mailService(
        newUser.email,
        "Verify your account",
        `Click here to verify your account ${process.env.FRONTEND_URL}/verify-account/${verificationToken}`
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
export const loginUser = async (req, res) => {
  console.log("start");

  // if cookie available
  if (req.user) {
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
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

      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    console.log(jwtToken);

    console.log("token created");

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Important for cross-origin
      maxAge: 24 * 60 * 60 * 1000,
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

export const profile = async (req, res) => {
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

export const logoutUser = (req, res) => {
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
export const forgotPassword = async (req, res) => {
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
    mailService(
      userSave.email,
      "Reset Your Password",
      `Click here to reset your password ${process.env.FRONTEND_URL}/reset-password/${randomToken}`
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

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!password) {
    return res.status(401).json({
      message: "password is required",
    });
  }
  try {
    const userFound = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
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
export const verifyUser = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
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
