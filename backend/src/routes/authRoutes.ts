import express from "express";
import { getMe, login, verifyEmail } from "../controllers/AuthController";
import { refresh } from "../controllers/AuthController";
import { registerUser } from "../controllers/AuthController";

const router = express.Router();

router.post("/login", login);
router.get("/refresh", refresh);
router.post("/register", registerUser);
router.get("/verify/:token", verifyEmail);


export default router;