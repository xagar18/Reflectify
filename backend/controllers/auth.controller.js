import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";

// register new user
export const registerUser = async (req, res) => {
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
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    if (newUser) {
      console.log("User Registered Successfully.");
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
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist, please register.",
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
    const token = jwt.sign(
      { id: existingUser.id },

      "shhhhh",
      {
        expiresIn: "60h",
      }
    );
    console.log("token created");

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);
    console.log("cookie set");

    res.status(200).json({
      success: true,
      message: "Login Successful.",
      token,
      user: {
        id: existingUser.id,
        name: existingUser.name,
      },
    });
  } catch (error) {}
};

// verification, mailsender (services)
