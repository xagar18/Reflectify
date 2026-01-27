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

// Middleware that requires authentication (returns 401 if not authenticated)
export const authenticateToken = async (req, res, next) => {
  try {
    const jwtToken = req.cookies.token;

    if (!jwtToken) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
