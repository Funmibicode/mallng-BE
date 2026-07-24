import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";



// @desc Protect routes — verify token
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ msg: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ msg: "Not authorized, no token" });
  }
};



// @desc Authorize roles — check if user has permission
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Not authorized, no user found" });
    }

    if (roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ msg: "Not authorized, insufficient permissions" });
  };
};



export { protect, authorize };