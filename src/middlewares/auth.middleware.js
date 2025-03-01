import jwt from "jsonwebtoken";
import { AuthError } from "../errors/TypeError.js";
import { config } from "../config/env.config.js";
import { User } from "../models/User.model.js";

export const authMiddleware = (req, res, next) => {  // <-- You forgot `next` here
    try {
        const authorization = req.headers.authorization;

        const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
        if (!token) throw new AuthError('Not proporcioned token', 498, 'Token not found, is null or has an invalid format');

        const decoded = jwt.verify(token, config.secretKey);
        req.user = decoded;
        next();  // <-- You need to call `next()` or the request will hang!

    } catch (error) {
        console.error("JWT Verification Error:", error);
        throw new AuthError('YOU SHALL NOT PASS!!🧙‍♂️', 498, error.message);
    }
};

// Middleware to check if the user is GlobalAdmin
export const isGlobalAdmin = (req, res, next) => {
    if (req.user.role !== "globalAdmin") {
        return res.status(403).json({ message: "Unauthorized: GlobalAdmin privileges required." });
    }
    next();
};
