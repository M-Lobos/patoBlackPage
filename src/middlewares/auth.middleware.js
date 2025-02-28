import jwt from "jsonwebtoken";
import { AuthError } from "../errors/TypeError.js";
import { config } from "../config/env.config.js";
import { User } from "../models/User.model.js";

/* export const verifyToken = async (req, res, next) => {
    console.log(req.headers.authorization);
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
 */

/* export const authMiddleware = (req, res) => {
    try {
        const authorization = req.headers.authorization;
        const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

        if(!token) throw new AuthError('Token no proporcionado', 498, 'El token no se encontro, es nulo o tiene un formato inválido');

        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; //Este va a ser útil proximamente
        
    } catch (error) {
        throw new AuthError('YOU SHALL NOT PASS!!🧙‍♂️' , 498, error);
    }
}; */


export const authMiddleware = (req, res, next) => {  // <-- You forgot `next` here
    try {
        const authorization = req.headers.authorization || 'qué';
        console.log("Authorization Header:", authorization);

        const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
        console.log("Extracted Token:", token);

        if (!token) throw new AuthError('Token no proporcionado', 498, 'El token no se encontró, es nulo o tiene un formato inválido');

        console.log("Verifying token...");
        const decoded = jwt.verify(token, config.secretKey);
        console.log("Decoded Token:", decoded);

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
