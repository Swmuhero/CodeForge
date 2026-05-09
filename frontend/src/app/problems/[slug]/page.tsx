"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Play, Send, TerminalSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Protected } from "@/components/Protected";
import { ResultPanel } from "@/components/ResultPanel";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { apiRequest } from "@/lib/api";
import { languages, monacoLanguage } from "@/lib/languages";
import type { JudgeResult, Language, Problem } from "@/lib/types";
import { difficultyClass } from "@/lib/ui";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function ProblemPage() {
  return (
    <Protected>
      <ProblemWorkspace />
    </Protected>
  );
}

function ProblemWorkspace() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug);
  const { token } = useAuth();
  const { theme } = useTheme();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [language, setLanguage] = useState<Language>("JS");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<"run" | "submit" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    apiRequest<{ problem: Problem }>(`/problems/${slug}`, { token })
      .then((data) => {
        if (!mounted) return;
        setProblem(data.problem);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load problem");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug, token]);

  useEffect(() => {
    if (!problem) return;
    const saved = window.localStorage.getItem(`draft:${slug}:${language}`);
    setCode(saved || problem.starterCode[language] || "");
    setResult(null);
  }, [language, problem, slug]);

  useEffect(() => {
    if (!problem || !code) return;
    window.localStorage.setItem(`draft:${slug}:${language}`, code);
  }, [code, language, problem, slug]);

  const sampleCases = useMemo(() => problem?.publicTestCases || [], [problem]);

  async function execute(mode: "run" | "submit") {
    if (!token) {
      router.push("/login");
      return;
    }

    setRunning(mode);
    setError("");

    try {
      const data = await apiRequest<{ result: JudgeResult }>(`/problems/${slug}/${mode}`, {
        method: "POST",
        token,
        body: JSON.stringify({ language, code })
      });
      setResult(data.result);
      if (mode === "submit" && data.result.verdict === "Accepted") {
        setProblem((current) => (current ? { ...current, solved: true } : current));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Execution failed");
    } finally {
      setRunning(null);
    }
  }

  if (loading) {
    return <div className="py-12 text-center text-muted">Loading problem...</div>;
  }

  if (error && !problem) {
    return <div className="py-12 text-center text-rose-600 dark:text-rose-300">{error}</div>;
  }

  if (!problem) {
    return <div className="py-12 text-center text-muted">Problem not found.</div>;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <section className="rounded-md border border-borderline bg-panel shadow-soft">
        <div className="border-b border-borderline p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Link href="/problems" className="text-sm font-medium text-muted hover:text-ink">
              Problems
            </Link>
            <span className="text-muted">/</span>
            <span className={`rounded px-2 py-1 text-xs font-semibold ${difficultyClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            {problem.solved ? <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">Solved</span> : null}
          </div>
          <h1 className="text-2xl font-semibold">{problem.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {problem.tags.map((tag) => (
              <span key={tag} className="rounded bg-surface px-2 py-1 text-xs font-medium text-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6 p-5">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-muted">Description</h2>
            <p className="whitespace-pre-wrap leading-7">{problem.description}</p>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-muted">Constraints</h2>
            <ul className="space-y-2 text-sm">
              {problem.constraints.map((constraint) => (
                <li key={constraint} className="rounded bg-surface px-3 py-2 font-mono text-xs">
                  {constraint}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-muted">Samples</h2>
            <div className="space-y-3">
              {sampleCases.map((testCase, index) => (
                <div key={`${testCase.input}-${index}`} className="rounded-md border border-borderline bg-surface/70 p-3">
                  <div className="mb-2 text-sm font-semibold">Example {index + 1}</div>
                  <div className="grid gap-2 text-xs sm:grid-cols-2">
                    <pre className="overflow-auto rounded bg-black/5 p-2 dark:bg-black/30">
                      <span className="mb-1 block font-semibold text-muted">Input</span>
                      {testCase.input}
                    </pre>
                    <pre className="overflow-auto rounded bg-black/5 p-2 dark:bg-black/30">
                      <span className="mb-1 block font-semibold text-muted">Output</span>
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                  {testCase.explanation ? <p className="mt-2 text-sm text-muted">{testCase.explanation}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-md border border-borderline bg-panel shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderline px-4 py-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              Language
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className="focus-ring rounded-md border border-borderline bg-surface px-3 py-2 text-sm"
              >
                {languages.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => execute("run")}
                disabled={Boolean(running)}
                className="focus-ring flex items-center gap-2 rounded-md border border-borderline bg-surface px-3 py-2 text-sm font-semibold hover:bg-panel disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Play className="h-4 w-4" />
                {running === "run" ? "Running..." : "Run"}
              </button>
              <button
                type="button"
                onClick={() => execute("submit")}
                disabled={Boolean(running)}
                className="focus-ring flex items-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                {running === "submit" ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          <div className="h-[560px] min-h-[420px]">
            <MonacoEditor
              height="100%"
              language={monacoLanguage(language)}
              theme={theme === "dark" ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on"
              }}
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="flex items-center gap-2 text-sm font-semibold text-muted">
          <TerminalSquare className="h-4 w-4" />
          Console
        </div>
        <ResultPanel result={result} />
      </section>
    </div>
  );
}
