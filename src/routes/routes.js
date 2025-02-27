//routes path sweep file 👣

import { Router } from "express";

import authRouter from "./auth.routes.js";
/* import AdminProfile from "./user.routes.js"; */

const router = Router();

router.use("/auth-admin", authRouter);
/* router.use("/AdminMasterConsole", AdminProfile); */

export default router;