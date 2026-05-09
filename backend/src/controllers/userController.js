import { z } from "zod";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

export const submissionsQuerySchema = z.object({
  query: z.object({
    problemSlug: z.string().trim().max(140).optional()
  })
});

function emptyDifficultyStats() {
  return {
    totalSolved: 0,
    totalProblems: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    easyTotal: 0,
    mediumTotal: 0,
    hardTotal: 0
  };
}

export async function getMe(req, res, next) {
  try {
    const acceptedProblemIds = await Submission.distinct("problemId", {
      userId: req.user._id,
      result: "Accepted"
    });

    const stats = emptyDifficultyStats();
    const [totalProblems, difficultyTotals, solvedCounts] = await Promise.all([
      Problem.countDocuments(),
      Problem.aggregate([{ $group: { _id: "$difficulty", count: { $sum: 1 } } }]),
      acceptedProblemIds.length > 0
        ? Problem.aggregate([
            { $match: { _id: { $in: acceptedProblemIds } } },
            { $group: { _id: "$difficulty", count: { $sum: 1 } } }
          ])
        : []
    ]);

    stats.totalProblems = totalProblems;

    for (const item of difficultyTotals) {
      if (item._id === "Easy") stats.easyTotal = item.count;
      if (item._id === "Medium") stats.mediumTotal = item.count;
      if (item._id === "Hard") stats.hardTotal = item.count;
    }

    for (const item of solvedCounts) {
      stats.totalSolved += item.count;
      if (item._id === "Easy") stats.easySolved = item.count;
      if (item._id === "Medium") stats.mediumSolved = item.count;
      if (item._id === "Hard") stats.hardSolved = item.count;
    }

    const recentSubmissions = await Submission.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("problemId", "title slug difficulty")
      .lean();

    const totalSubmissions = await Submission.countDocuments({ userId: req.user._id });

    res.json({
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
      },
      stats,
      totalSubmissions,
      recentSubmissions
    });
  } catch (error) {
    next(error);
  }
}

export async function getSubmissions(req, res, next) {
  try {
    const { problemSlug } = req.validated.query;
    const query = { userId: req.user._id };

    if (problemSlug) {
      const problem = await Problem.findOne({ slug: problemSlug }).select("_id").lean();
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      query.problemId = problem._id;
    }

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("problemId", "title slug difficulty")
      .lean();

    res.json({ submissions });
  } catch (error) {
    next(error);
  }
}
