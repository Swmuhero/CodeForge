import express from "express";
import { getMe, getSubmissions, submissionsQuerySchema } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.get("/me/submissions", requireAuth, validate(submissionsQuerySchema), getSubmissions);

export default router;
