//routes sweep path file 👣

import { Router } from "express";

import authRouter from "./auth.routes.js";
import adminRouter from "./admin.routes.js";

const router = Router();

router.use("/auth-admin", authRouter);
router.use("/AdminMasterConsole", adminRouter);

export default router;