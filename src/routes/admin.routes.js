import { Router } from "express";
import { authMiddleware, isGlobalAdmin } from "../middlewares/auth.middleware.js";
import { createUser, 
        updateUser,
        deleteUserById,
        getAdmins,
        findPostByUser
} from "../controller/user.controller.js";

const router = Router();

// Only GlobalAdmins can access these routes
router.post("/create", authMiddleware, isGlobalAdmin, createUser);
router.get("/list-admin", getAdmins); //no need for authMiddleware as this route can be accessed by any user;
/*router.get("/find-post", verifyToken, isGlobalAdmin, findPostByUser);*/
router.put("/:id", authMiddleware, isGlobalAdmin, updateUser); 
router.delete("/:id", authMiddleware, isGlobalAdmin, deleteUserById);

// routes that can be accessed by any user/admin


export default router;
