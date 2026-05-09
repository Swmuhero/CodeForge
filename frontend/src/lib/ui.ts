import type { Difficulty, Verdict } from "./types";

export function difficultyClass(difficulty: Difficulty) {
  if (difficulty === "Easy") return "difficulty-easy";
  if (difficulty === "Medium") return "difficulty-medium";
  return "difficulty-hard";
}

export function verdictClass(verdict: Verdict) {
  if (verdict === "Accepted") return "text-emerald-600 dark:text-emerald-300";
  if (verdict === "Wrong Answer") return "text-rose-600 dark:text-rose-300";
  if (verdict === "Time Limit Exceeded") return "text-amber-600 dark:text-amber-300";
  return "text-orange-600 dark:text-orange-300";
}
