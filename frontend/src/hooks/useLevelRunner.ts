import { useEffect, useRef, useState } from "react";
import { makeHtmlBlob } from "../utils/makeHtmlBlob";
import { getApiBase } from "../utils/apiBase";
import type { TestResult } from "../utils/types";
import runInputTest from "../utils/runInputTest";
import { saveLevelCode } from "../utils/levelStorage";

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
      const url = URL.createObjectURL(
        makeHtmlBlob(htmlCode, cssCode, jsCode, null)
      );
      previewIframeRef.current.src = url;
      setTimeout(() => URL.revokeObjectURL(url), 500);
    }

    if (iframeRef.current) {
      iframeRef.current.src = "about:blank";
    }
  }, [chapterName, levelURL, htmlCode, cssCode, jsCode]);

  useEffect(() => {
    if (!chapterName || !levelURL) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(() => {
      saveLevelCode(chapterName, levelURL, htmlCode, cssCode, jsCode);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [htmlCode, cssCode, jsCode, chapterName, levelURL]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data) return;

      if (e.data.type === "runtime-error") {
        setRuntimeErrorLive({
          message: e.data.message,
          line: e.data.line ?? null,
        });
        return;
      }

      if (e.data.type === "test-result") {
        setHasRunTest(true);
        setTestResult(e.data.result);
        setRuntimeError(null);

        if (e.data.result?.pass && username && !isCompleted && levelURL) {
          setIsCompleted(true);
          fetch(`${getApiBase()}/complete-level`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level_name: levelURL }),
          }).catch(() => {});
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [username, isCompleted, levelURL, setIsCompleted]);

  const finishLevel = () => {
    if (username && !isCompleted && levelURL) {
      setIsCompleted(true);
      fetch(`${getApiBase()}/complete-level`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level_name: levelURL }),
      }).catch(() => {});
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

    if (TestFuncCode && iframeRef.current) {
      const url = URL.createObjectURL(
        makeHtmlBlob(htmlCode, cssCode, jsCode, TestFuncCode)
      );

      iframeRef.current.onload = () => {
        iframeRef.current?.contentWindow?.postMessage({ type: "run-test" }, "*");
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };

      iframeRef.current.src = url;
      return;
    }

    if (InputTestFuncCode) {
      const result = runInputTest(InputTestFuncCode, htmlCode || jsCode);
      setTestResult(result);
      if (result.pass && username && !isCompleted && levelURL) {
        setIsCompleted(true);
        fetch(`${getApiBase()}/complete-level`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level_name: levelURL }),
        }).catch(() => {});
      }
      return;
    }

    finishLevel();
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
