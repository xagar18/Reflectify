import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies);
    const jwtToken = req.cookies.token;
    console.log("JWT Token found:", jwtToken ? "Yes" : "No");

    // If no token => just move on (dont throw error)
    if (!jwtToken) {
      req.user = null;
      console.log("No token found, user not authenticated");
      return next();
    }

    // If token exists => verify and attach user
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    console.log("Token verified successfully, user ID:", decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    req.user = null; // continue but mark as unauthenticated
    next();
  }
};
