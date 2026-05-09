export type Language = "Java" | "JS" | "Python" | "C++";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Verdict = "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export type TestCase = {
  input: string;
  expectedOutput: string;
  explanation?: string;
};

export type ProblemListItem = {
  _id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  tags: string[];
  publicTestCaseCount: number;
  solved: boolean;
};

export type Problem = ProblemListItem & {
  description: string;
  constraints: string[];
  publicTestCases: TestCase[];
  starterCode: Record<Language, string>;
};

export type JudgeCase = {
  index: number;
  status: Verdict;
  passed: boolean;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  stderr?: string;
  executionTimeMs: number;
  hidden?: boolean;
};

export type JudgeResult = {
  verdict: Verdict;
  passedTestCases: number;
  totalTestCases: number;
  executionTimeMs: number;
  cases: JudgeCase[];
};

export type Submission = {
  _id: string;
  problemId: {
    _id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
  };
  language: Language;
  result: Verdict;
  executionTimeMs: number;
  passedTestCases: number;
  totalTestCases: number;
  createdAt: string;
};
