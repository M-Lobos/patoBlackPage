import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith("Bearer ") 
            ? authHeader.split(" ")[1] 
            : req.cookies?.token || req.query?.token;   // checks on cookies an query tokes if front end store it in cookies or so.

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

// Middleware to check if the user is GlobalAdmin
export const isGlobalAdmin = (req, res, next) => {
    if (req.user.role !== "GlobalAdmin") {
        return res.status(403).json({ message: "Unauthorized: GlobalAdmin privileges required." });
    }
    next();
};
