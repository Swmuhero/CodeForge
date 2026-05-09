"use client";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import type { JudgeResult } from "@/lib/types";
import { verdictClass } from "@/lib/ui";

export function ResultPanel({ result }: { result: JudgeResult | null }) {
  if (!result) {
    return (
      <div className="rounded-md border border-borderline bg-panel p-4 text-sm text-muted">
        Console output will appear here after running or submitting code.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-borderline bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderline px-4 py-3">
        <div className="flex items-center gap-2">
          {result.verdict === "Accepted" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <XCircle className="h-5 w-5 text-rose-500" />
          )}
          <span className={`font-semibold ${verdictClass(result.verdict)}`}>{result.verdict}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Clock3 className="h-4 w-4" />
          {result.executionTimeMs} ms
        </div>
        <span className="text-sm text-muted">
          {result.passedTestCases}/{result.totalTestCases} passed
        </span>
      </div>

      <div className="max-h-80 space-y-3 overflow-auto p-4">
        {result.cases.map((testCase) => (
          <div key={testCase.index} className="rounded-md border border-borderline bg-surface/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">
                {testCase.hidden ? "Hidden Case" : `Case ${testCase.index + 1}`}
              </span>
              <span className={`text-sm font-medium ${verdictClass(testCase.status)}`}>{testCase.status}</span>
            </div>
            {testCase.hidden ? (
              <p className="text-sm text-muted">Input and expected output are hidden for submit tests.</p>
            ) : (
              <div className="grid gap-2 text-xs sm:grid-cols-3">
                <pre className="min-h-16 overflow-auto rounded bg-black/5 p-2 dark:bg-black/30">
                  <span className="mb-1 block font-semibold text-muted">Input</span>
                  {testCase.input}
                </pre>
                <pre className="min-h-16 overflow-auto rounded bg-black/5 p-2 dark:bg-black/30">
                  <span className="mb-1 block font-semibold text-muted">Expected</span>
                  {testCase.expectedOutput}
                </pre>
                <pre className="min-h-16 overflow-auto rounded bg-black/5 p-2 dark:bg-black/30">
                  <span className="mb-1 block font-semibold text-muted">Output</span>
                  {testCase.actualOutput}
                </pre>
              </div>
            )}
            {testCase.stderr ? (
              <pre className="mt-2 max-h-28 overflow-auto rounded bg-rose-500/10 p-2 text-xs text-rose-700 dark:text-rose-200">
                {testCase.stderr}
              </pre>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
