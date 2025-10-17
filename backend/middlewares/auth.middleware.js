import jwt from 'jsonwebtoken'

export const isLoggedIn = async (req, res, next) => {
  try {
    const jwtToken = req.cookies.token;

    // If no token => just move on (dont throw error)
    if (!jwtToken) {
      req.user = null;
      return next();
    }

    // If token exists => verify and attach user
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    req.user = null; // continue but mark as unauthenticated
    next();
  }
};
