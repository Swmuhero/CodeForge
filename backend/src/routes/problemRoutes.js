import express from "express";
import {
  codeRunSchema,
  getProblem,
  listProblems,
  listProblemsSchema,
  problemSlugSchema,
  runCode,
  submitCode
} from "../controllers/problemController.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", optionalAuth, validate(listProblemsSchema), listProblems);
router.get("/:slug", optionalAuth, validate(problemSlugSchema), getProblem);
router.post("/:slug/run", requireAuth, validate(codeRunSchema), runCode);
router.post("/:slug/submit", requireAuth, validate(codeRunSchema), submitCode);

export default router;
