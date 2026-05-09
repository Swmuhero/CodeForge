"use client";

import { CheckCircle2, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { apiRequest } from "@/lib/api";
import type { Difficulty, ProblemListItem } from "@/lib/types";
import { difficultyClass } from "@/lib/ui";

const filters: Array<Difficulty | "All"> = ["All", "Easy", "Medium", "Hard"];
const difficultyOrder: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };

export default function ProblemsPage() {
  const { token } = useAuth();
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (difficulty !== "All") params.set("difficulty", difficulty);
        if (search.trim()) params.set("search", search.trim());
        const query = params.toString() ? `?${params.toString()}` : "";
        const data = await apiRequest<{ problems: ProblemListItem[] }>(`/problems${query}`, {
          token,
          signal: controller.signal
        });
        setProblems(data.problems);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Failed to load problems");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [difficulty, search, token]);

  const solvedCount = useMemo(() => problems.filter((problem) => problem.solved).length, [problems]);
  const sortedProblems = useMemo(
    () => [...problems].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] || a.title.localeCompare(b.title)),
    [problems]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold">Problems</h1>
          <p className="mt-1 text-sm text-muted">
            {solvedCount} solved in this view. Public tests are for Run, hidden tests are reserved for Submit.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="focus-ring h-10 w-full rounded-md border border-borderline bg-panel pl-9 pr-3 text-sm sm:w-64"
            />
          </label>

          <div className="flex rounded-md border border-borderline bg-panel p-1">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDifficulty(item)}
                className={[
                  "focus-ring rounded px-3 py-1.5 text-sm font-medium transition",
                  difficulty === item ? "bg-teal-600 text-white" : "text-muted hover:text-ink"
                ].join(" ")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-borderline bg-panel shadow-soft">
        <div className="grid grid-cols-[64px_1fr_110px] border-b border-borderline px-4 py-3 text-xs font-semibold uppercase text-muted md:grid-cols-[64px_1fr_140px_220px_90px]">
          <span>Status</span>
          <span>Title</span>
          <span>Difficulty</span>
          <span className="hidden md:block">Tags</span>
          <span className="hidden text-right md:block">Samples</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted">Loading problems...</div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 dark:text-rose-300">{error}</div>
        ) : sortedProblems.length === 0 ? (
          <div className="p-8 text-center text-muted">No problems found.</div>
        ) : (
          sortedProblems.map((problem) => (
            <Link
              key={problem.slug}
              href={`/problems/${problem.slug}`}
              className="grid grid-cols-[64px_1fr_110px] items-center border-b border-borderline px-4 py-4 transition last:border-b-0 hover:bg-surface md:grid-cols-[64px_1fr_140px_220px_90px]"
            >
              <span>
                {problem.solved ? <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-label="Solved" /> : <span className="text-muted">-</span>}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium">{problem.title}</span>
                <span className="mt-1 block truncate text-xs text-muted md:hidden">{problem.tags.join(", ")}</span>
              </span>
              <span>
                <span className={`rounded px-2 py-1 text-xs font-semibold ${difficultyClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </span>
              <span className="hidden min-w-0 text-sm text-muted md:block">{problem.tags.join(", ")}</span>
              <span className="hidden text-right text-sm text-muted md:block">{problem.publicTestCaseCount}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
