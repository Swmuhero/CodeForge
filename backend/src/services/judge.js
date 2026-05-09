import { LANGUAGE_CONFIGS, assertSupportedLanguage } from "../config/languages.js";

const OUTPUT_LIMIT_CHARS = 4000;
const POLL_INTERVAL_MS = 600;
const DEFAULT_POLL_TIMEOUT_MS = 15000;

function normalizeOutput(value) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function outputPreview(value) {
  const normalized = String(value ?? "").replace(/\r\n/g, "\n");
  if (normalized.length <= OUTPUT_LIMIT_CHARS) {
    return normalized;
  }
  return `${normalized.slice(0, OUTPUT_LIMIT_CHARS)}\n...[truncated]`;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getJudge0BaseUrl() {
  return (process.env.JUDGE0_API_URL || "https://ce.judge0.com").replace(/\/+$/, "");
}

function getJudge0Headers() {
  const headers = {
    "Content-Type": "application/json"
  };

  if (process.env.JUDGE0_API_KEY) {
    const headerName =
      process.env.JUDGE0_API_KEY_HEADER ||
      (getJudge0BaseUrl().includes("rapidapi") ? "X-RapidAPI-Key" : "X-Auth-Token");
    headers[headerName] = process.env.JUDGE0_API_KEY;
  }

  if (process.env.JUDGE0_RAPIDAPI_HOST) {
    headers["X-RapidAPI-Host"] = process.env.JUDGE0_RAPIDAPI_HOST;
  }

  return headers;
}

function getLanguageId(language) {
  const config = LANGUAGE_CONFIGS[language];
  const override = process.env[`JUDGE0_LANGUAGE_ID_${config.envKey}`];
  return Number(override || config.judge0LanguageId);
}

function envBoolean(name, defaultValue) {
  const value = process.env[name];
  if (typeof value === "undefined") {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function createSubmissionPayload({ language, code, stdin }) {
  return {
    source_code: code,
    language_id: getLanguageId(language),
    stdin,
    cpu_time_limit: Number(process.env.JUDGE0_CPU_TIME_LIMIT_SECONDS || 2),
    cpu_extra_time: Number(process.env.JUDGE0_CPU_EXTRA_TIME_SECONDS || 0.5),
    wall_time_limit: Number(process.env.JUDGE0_WALL_TIME_LIMIT_SECONDS || 5),
    memory_limit: Number(process.env.JUDGE0_MEMORY_LIMIT_KB || 128000),
    stack_limit: Number(process.env.JUDGE0_STACK_LIMIT_KB || 64000),
    max_processes_and_or_threads: Number(process.env.JUDGE0_MAX_PROCESSES || 60),
    enable_network: false,
    enable_per_process_and_thread_time_limit: envBoolean("JUDGE0_ENABLE_PER_PROCESS_TIME_LIMIT", false),
    enable_per_process_and_thread_memory_limit: envBoolean("JUDGE0_ENABLE_PER_PROCESS_MEMORY_LIMIT", false),
    max_file_size: Number(process.env.JUDGE0_MAX_FILE_SIZE_KB || 1024)
  };
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function requestJudge0(path, options = {}) {
  const response = await fetch(`${getJudge0BaseUrl()}${path}`, {
    ...options,
    headers: {
      ...getJudge0Headers(),
      ...options.headers
    }
  });
  const data = await parseJsonResponse(response);

  if (!response.ok) {
    const error = new Error(data.message || data.error || "Judge0 request failed");
    error.statusCode = 503;
    error.details = data;
    throw error;
  }

  return data;
}

async function createSubmission(payload) {
  const data = await requestJudge0("/submissions?base64_encoded=false&wait=false", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!data.token) {
    const error = new Error("Judge0 did not return a submission token");
    error.statusCode = 503;
    error.details = data;
    throw error;
  }

  return data.token;
}

async function getSubmission(token) {
  const fields = "stdout,stderr,compile_output,message,status,time,memory,token";
  return requestJudge0(`/submissions/${token}?base64_encoded=false&fields=${fields}`);
}

async function waitForSubmission(token) {
  const pollTimeoutMs = Number(process.env.JUDGE0_POLL_TIMEOUT_MS || DEFAULT_POLL_TIMEOUT_MS);
  const startedAt = Date.now();

  while (Date.now() - startedAt < pollTimeoutMs) {
    const submission = await getSubmission(token);
    const statusId = submission.status?.id;

    if (statusId && statusId > 2) {
      return {
        ...submission,
        elapsedTimeMs: Date.now() - startedAt
      };
    }

    await sleep(POLL_INTERVAL_MS);
  }

  return {
    status: {
      id: 5,
      description: "Time Limit Exceeded"
    },
    stdout: "",
    stderr: "Judge0 polling timed out before the submission completed.",
    compile_output: "",
    message: "",
    time: String(pollTimeoutMs / 1000),
    elapsedTimeMs: pollTimeoutMs
  };
}

async function runJudge0Case({ language, code, testCase }) {
  const startedAt = Date.now();
  const token = await createSubmission(
    createSubmissionPayload({
      language,
      code,
      stdin: testCase.input
    })
  );
  const submission = await waitForSubmission(token);
  const judgeTimeMs = Math.round(Number(submission.time || 0) * 1000);

  return {
    submission,
    executionTimeMs: judgeTimeMs || submission.elapsedTimeMs || Date.now() - startedAt
  };
}

function mapJudge0Status(submission, expectedOutput) {
  const statusId = submission.status?.id;

  if (statusId === 5) {
    return "Time Limit Exceeded";
  }

  if (statusId === 3) {
    return normalizeOutput(submission.stdout) === normalizeOutput(expectedOutput) ? "Accepted" : "Wrong Answer";
  }

  if (statusId === 4) {
    return "Wrong Answer";
  }

  return "Runtime Error";
}

function toCaseResult(testCase, runResult, index) {
  const { submission, executionTimeMs } = runResult;
  const status = mapJudge0Status(submission, testCase.expectedOutput);
  const diagnostics = [submission.stderr, submission.compile_output, submission.message]
    .filter(Boolean)
    .join("\n");

  return {
    index,
    status,
    passed: status === "Accepted",
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
    actualOutput: outputPreview(submission.stdout),
    stderr: outputPreview(diagnostics),
    executionTimeMs
  };
}

export async function executeCode({ language, code, testCases }) {
  assertSupportedLanguage(language);

  const cases = [];
  let verdict = "Accepted";
  let passedTestCases = 0;
  let executionTimeMs = 0;

  for (const [index, testCase] of testCases.entries()) {
    const runResult = await runJudge0Case({ language, code, testCase });
    executionTimeMs += runResult.executionTimeMs;
    const caseResult = toCaseResult(testCase, runResult, index);
    cases.push(caseResult);

    if (caseResult.passed) {
      passedTestCases += 1;
      continue;
    }

    verdict = caseResult.status;
    break;
  }

  return {
    verdict,
    passedTestCases,
    totalTestCases: testCases.length,
    executionTimeMs,
    cases
  };
}
