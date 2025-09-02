import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

/**
 * Role-based authentication middleware
 * @param {Array} requiredRoles - Array of roles allowed to access the resource
 * @returns {Function} Express middleware
 */
const roleAuth = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const { token } = req.headers;
      
      if (!token) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user with role and permissions
      const user = await userModel.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }
      
      if (!user.isActive) {
        return res.status(403).json({ success: false, message: "Account is deactivated" });
      }
      
      // Check if user role is in the required roles list
      // Empty requiredRoles array means all authenticated users are allowed
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: "You don't have permission to access this resource" 
        });
      }
      
      // Update last login time
      await userModel.findByIdAndUpdate(user._id, { lastLogin: Date.now() });
      
      // Add user to request object
      req.user = user;
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: "Token expired" });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  };
};

export default roleAuth;
