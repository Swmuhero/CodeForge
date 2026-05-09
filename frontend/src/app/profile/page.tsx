"use client";

import { BarChart3, CheckCircle2, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Protected } from "@/components/Protected";
import { useAuth } from "@/components/AuthProvider";
import { apiRequest } from "@/lib/api";
import type { Submission, User } from "@/lib/types";
import { difficultyClass, verdictClass } from "@/lib/ui";

type ProfileResponse = {
  user: User;
  stats: {
    totalSolved: number;
    totalProblems: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    easyTotal: number;
    mediumTotal: number;
    hardTotal: number;
  };
  totalSubmissions: number;
  recentSubmissions: Submission[];
};

export default function ProfilePage() {
  return (
    <Protected>
      <ProfileContent />
    </Protected>
  );
}

function ProfileContent() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    apiRequest<ProfileResponse>("/users/me", { token })
      .then(setProfile)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile"));
  }, [token]);

  if (error) {
    return <div className="py-12 text-center text-rose-600 dark:text-rose-300">{error}</div>;
  }

  if (!profile) {
    return <div className="py-12 text-center text-muted">Loading profile...</div>;
  }

  const progressPercent =
    profile.stats.totalProblems > 0
      ? Math.round((profile.stats.totalSolved / profile.stats.totalProblems) * 100)
      : 0;
  const stats = [
    { label: "Solved", value: `${profile.stats.totalSolved}/${profile.stats.totalProblems}`, tone: "text-ink" },
    { label: "Easy", value: `${profile.stats.easySolved}/${profile.stats.easyTotal}`, tone: "text-emerald-600 dark:text-emerald-300" },
    { label: "Medium", value: `${profile.stats.mediumSolved}/${profile.stats.mediumTotal}`, tone: "text-amber-600 dark:text-amber-300" },
    { label: "Hard", value: `${profile.stats.hardSolved}/${profile.stats.hardTotal}`, tone: "text-rose-600 dark:text-rose-300" }
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-md border border-borderline bg-panel p-5 shadow-soft">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold">{profile.user.name}</h1>
            <p className="mt-1 text-sm text-muted">{profile.user.email}</p>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm text-muted">
            <History className="h-4 w-4" />
            {profile.totalSubmissions} submissions
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium">Problem progress</span>
            <span className="text-muted">
              {profile.stats.totalSolved} / {profile.stats.totalProblems} solved
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="text-xs font-medium text-muted">{progressPercent}% complete</div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-md border border-borderline bg-panel p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between text-sm text-muted">
              <span>{item.label}</span>
              <BarChart3 className="h-4 w-4" />
            </div>
            <div className={`text-3xl font-semibold ${item.tone}`}>{item.value}</div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-md border border-borderline bg-panel shadow-soft">
        <div className="flex items-center gap-2 border-b border-borderline px-4 py-3 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-teal-600" />
          Submission History
        </div>

        {profile.recentSubmissions.length === 0 ? (
          <div className="p-8 text-center text-muted">No submissions yet.</div>
        ) : (
          <div className="divide-y divide-borderline">
            {profile.recentSubmissions.map((submission) => (
              <div key={submission._id} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_110px_110px_110px_160px] md:items-center">
                <Link href={`/problems/${submission.problemId.slug}`} className="min-w-0 font-medium hover:text-teal-700 dark:hover:text-teal-300">
                  <span className="block truncate">{submission.problemId.title}</span>
                  <span className={`mt-1 inline-block rounded px-2 py-1 text-xs font-semibold ${difficultyClass(submission.problemId.difficulty)}`}>
                    {submission.problemId.difficulty}
                  </span>
                </Link>
                <span className="text-sm font-medium">{submission.language}</span>
                <span className={`text-sm font-semibold ${verdictClass(submission.result)}`}>{submission.result}</span>
                <span className="text-sm text-muted">
                  {submission.passedTestCases}/{submission.totalTestCases} passed
                </span>
                <span className="text-sm text-muted">{new Date(submission.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
