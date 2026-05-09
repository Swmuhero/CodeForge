export const SUPPORTED_LANGUAGES = Object.freeze(["Java", "JS", "Python", "C++"]);

export const LANGUAGE_CONFIGS = Object.freeze({
  Java: {
    label: "Java",
    monaco: "java",
    judge0LanguageId: 62,
    envKey: "JAVA"
  },
  JS: {
    label: "JavaScript",
    monaco: "javascript",
    judge0LanguageId: 63,
    envKey: "JS"
  },
  Python: {
    label: "Python",
    monaco: "python",
    judge0LanguageId: 71,
    envKey: "PYTHON"
  },
  "C++": {
    label: "C++",
    monaco: "cpp",
    judge0LanguageId: 54,
    envKey: "CPP"
  }
});

export function assertSupportedLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    const allowed = SUPPORTED_LANGUAGES.join(", ");
    const error = new Error(`Unsupported language. Allowed languages: ${allowed}`);
    error.statusCode = 400;
    throw error;
  }
}
