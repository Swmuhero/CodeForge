import type { Language } from "./types";

export const languages: Array<{ value: Language; label: string; monaco: string }> = [
  { value: "Java", label: "Java", monaco: "java" },
  { value: "JS", label: "JavaScript", monaco: "javascript" },
  { value: "Python", label: "Python", monaco: "python" },
  { value: "C++", label: "C++", monaco: "cpp" }
];

export function monacoLanguage(language: Language) {
  return languages.find((item) => item.value === language)?.monaco || "plaintext";
}
