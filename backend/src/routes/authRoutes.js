import express from "express";
import { login, loginSchema, logout, register, registerSchema } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;
