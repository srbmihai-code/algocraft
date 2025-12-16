import type { TestResult } from "./types";

export default function runInputTest(code: string, html: string): TestResult {
  try {
    const testFunc = new Function("html", code + "\nreturn runTest(html);") as (html: string) => TestResult;
    return testFunc(html);
  } catch (err: any) {
    return { pass: false, message: `❌ Eroare la rularea testului: ${err.message}` };
  }
}
