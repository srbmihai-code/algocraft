import { useEffect, useRef, useState } from "react";
import { makeHtmlBlob } from "../utils/makeHtmlBlob";
import { getApiBase } from "../utils/apiBase";
import type { TestResult } from "../utils/types";
import runInputTest from "../utils/runInputTest";

interface UseLevelRunnerProps {
  chapterName?: string;
  levelURL?: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  TestFuncCode: string | null;
  InputTestFuncCode: string | null;
  username: string | null;
  isCompleted: boolean;
  setIsCompleted: (completed: boolean) => void;
}

export function useLevelRunner({
  chapterName,
  levelURL,
  htmlCode,
  cssCode,
  jsCode,
  TestFuncCode,
  InputTestFuncCode,
  username,
  isCompleted,
  setIsCompleted,
}: UseLevelRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<number | null>(null);

  const [runtimeError, setRuntimeError] = useState<{ message: string; line: number | null } | null>(null);
  const [runtimeErrorLive, setRuntimeErrorLive] = useState<{ message: string; line: number | null } | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [hasRunTest, setHasRunTest] = useState(false);

  useEffect(() => {
    setRuntimeError(null);
    setRuntimeErrorLive(null);
    setTestResult(null);
    setHasRunTest(false);

    if (previewIframeRef.current) {
      const previewBlob = makeHtmlBlob(htmlCode, cssCode, jsCode, null);
      const url = URL.createObjectURL(previewBlob);
      previewIframeRef.current.src = url;
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }


    if (iframeRef.current && TestFuncCode) {
      const testBlob = makeHtmlBlob(htmlCode, cssCode, jsCode, TestFuncCode);
      const url = URL.createObjectURL(testBlob);
      iframeRef.current.src = url;
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

  }, [chapterName, levelURL, htmlCode, cssCode, jsCode, TestFuncCode]);

  useEffect(() => {
    if (!chapterName || !levelURL) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const data = JSON.stringify({ html: htmlCode, css: cssCode, js: jsCode });
      document.cookie = `level_${chapterName}_${levelURL}=${data}; path=/`;
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [htmlCode, cssCode, jsCode, chapterName, levelURL]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data) return;

      if (e.data.type === "runtime-error") {
        setRuntimeErrorLive({
          message: e.data.message || "Eroare necunoscută în timpul rulării",
          line: e.data.line || null,
        });
      }

      if (e.data.type === "test-result" && !runtimeErrorLive) {
        setTestResult(e.data.result);
        setRuntimeError(null);

        if (e.data.result?.pass && username && !isCompleted && levelURL) {
          fetch(`${getApiBase()}/complete-level`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level_name: levelURL }),
          }).then(() => setIsCompleted(true)).catch(console.error);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [runtimeErrorLive, username, isCompleted, levelURL, setIsCompleted]);

  const finishLevel = async () => {
    if ((!InputTestFuncCode && !TestFuncCode) && username && !isCompleted && levelURL) {
      await fetch(`${getApiBase()}/complete-level`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level_name: levelURL }),
      });
      setIsCompleted(true);
    }
  };

  const runTest = () => {
    setHasRunTest(true);
    setTestResult(null);
    setRuntimeError(null);

    if (runtimeErrorLive) {
      setRuntimeError(runtimeErrorLive);
      return;
    }

    const iframe = iframeRef.current;

    if (iframe && TestFuncCode) {
      const blob = makeHtmlBlob(htmlCode, cssCode, jsCode, TestFuncCode);
      const url = URL.createObjectURL(blob);
      iframe.onload = () => {
        iframe.contentWindow?.postMessage({ type: "run-test" }, "*");
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      };
      iframe.src = url;
    } else if (InputTestFuncCode) {
      const result = runInputTest(InputTestFuncCode, htmlCode || jsCode);
      setTestResult(result);
    } else {
      finishLevel();
    }
  };

  return {
    iframeRef,
    previewIframeRef,
    runtimeError,
    runtimeErrorLive,
    testResult,
    hasRunTest,
    runTest,
    finishLevel,
  };
}
