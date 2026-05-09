import { z } from "zod";
import { SUPPORTED_LANGUAGES } from "../config/languages.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { getCache, setCache } from "../services/cache.js";
import { executeCode } from "../services/judge.js";

const difficultyValues = ["Easy", "Medium", "Hard"];

export const listProblemsSchema = z.object({
  query: z.object({
    difficulty: z.enum(difficultyValues).optional(),
    search: z.string().trim().max(80).optional()
  })
});

export const problemSlugSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1).max(140)
  })
});

export const codeRunSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1).max(140)
  }),
  body: z.object({
    language: z.enum(SUPPORTED_LANGUAGES),
    code: z.string().min(1).max(200000)
  })
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function addSolvedStatus(problems, userId) {
  if (!userId || problems.length === 0) {
    return problems.map((problem) => ({ ...problem, solved: false }));
  }

  const problemIds = problems.map((problem) => problem._id);
  const solvedProblemIds = await Submission.distinct("problemId", {
    userId,
    problemId: { $in: problemIds },
    result: "Accepted"
  });
  const solvedSet = new Set(solvedProblemIds.map((id) => id.toString()));

  return problems.map((problem) => ({
    ...problem,
    solved: solvedSet.has(problem._id.toString())
  }));
}

export async function listProblems(req, res, next) {
  try {
    const { difficulty, search } = req.validated.query;
    const cacheKey = `problems:${difficulty || "all"}:${search || ""}`;
    let problems = getCache(cacheKey);

    if (!problems) {
      const query = {};

      if (difficulty) {
        query.difficulty = difficulty;
      }

      if (search) {
        const regex = new RegExp(escapeRegExp(search), "i");
        query.$or = [{ title: regex }, { tags: regex }];
      }

      problems = await Problem.find(query)
        .select("title slug difficulty tags publicTestCases")
        .sort({ difficulty: 1, title: 1 })
        .lean();

      problems = problems.map((problem) => ({
        _id: problem._id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        tags: problem.tags,
        publicTestCaseCount: problem.publicTestCases.length
      }));

      setCache(cacheKey, problems, 60000);
    }

    const withSolvedStatus = await addSolvedStatus(problems, req.user?._id);
    res.json({ problems: withSolvedStatus });
  } catch (error) {
    next(error);
  }
}

export async function getProblem(req, res, next) {
  try {
    const { slug } = req.validated.params;
    const problem = await Problem.findOne({ slug }).select("-hiddenTestCases").lean();

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const [withSolved] = await addSolvedStatus([problem], req.user?._id);
    res.json({ problem: withSolved });
  } catch (error) {
    next(error);
  }
}

export async function runCode(req, res, next) {
  try {
    const { slug } = req.validated.params;
    const { language, code } = req.validated.body;
    const problem = await Problem.findOne({ slug }).select("publicTestCases").lean();

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const result = await executeCode({
      language,
      code,
      testCases: problem.publicTestCases
    });

    res.json({ mode: "run", result });
  } catch (error) {
    next(error);
  }
}

export async function submitCode(req, res, next) {
  try {
    const { slug } = req.validated.params;
    const { language, code } = req.validated.body;
    const problem = await Problem.findOne({ slug }).select("publicTestCases hiddenTestCases").lean();

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const testCases = [...problem.publicTestCases, ...problem.hiddenTestCases];
    const result = await executeCode({
      language,
      code,
      testCases
    });
    const publicCaseCount = problem.publicTestCases.length;
    const safeResult = {
      ...result,
      cases: result.cases.map((testCase) => {
        if (testCase.index < publicCaseCount) {
          return testCase;
        }

        return {
          index: testCase.index,
          status: testCase.status,
          passed: testCase.passed,
          executionTimeMs: testCase.executionTimeMs,
          hidden: true,
          stderr: testCase.status === "Runtime Error" || testCase.status === "Time Limit Exceeded" ? testCase.stderr : ""
        };
      })
    };

    const submission = await Submission.create({
      userId: req.user._id,
      problemId: problem._id,
      code,
      language,
      result: result.verdict,
      executionTimeMs: result.executionTimeMs,
      passedTestCases: result.passedTestCases,
      totalTestCases: result.totalTestCases
    });

    res.status(201).json({
      mode: "submit",
      result: safeResult,
      submissionId: submission._id
    });
  } catch (error) {
    next(error);
  }
}
