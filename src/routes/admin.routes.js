import { Router } from "express";
import { verifyToken, isGlobalAdmin } from "../middlewares/auth.middleware.js";
import { createUser, 
        updateUser,
        deleteUserById,
        getAdmins,
        findPostByUser
} from "../controller/user.controller.js";

const router = Router();

// Only GlobalAdmins can access these routes
router.post("/create", verifyToken, isGlobalAdmin, createUser);
router.get("/", verifyToken, isGlobalAdmin, getAdmins);
router.get("/find-post", verifyToken, isGlobalAdmin, findPostByUser);
router.put("/:id", verifyToken, isGlobalAdmin, updateUser);
router.delete("/:id", verifyToken, isGlobalAdmin, deleteUserById);

// routes that can be accessed by any user/admin


export default router;
