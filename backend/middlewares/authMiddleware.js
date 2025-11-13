
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * authMiddleware checks authentication and optionally role.
 * @param {string} [requiredRole] - pass "admin" to restrict access
 */
export const authMiddleware = (requiredRole) => async (req, res, next) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
      
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role; 

    
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    next();
  } catch (err) {
    console.error(err);
     
    res.status(401).json({ message: "Invalid token" });
  }
};
