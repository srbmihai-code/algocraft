import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { linter, lintGutter } from "@codemirror/lint";
import type { TestResult } from "../tests/types";
import { parse } from "acorn";
import { makeHtmlBlob } from "../utils/makeHtmlBlob";
import ReactMarkdown from "react-markdown";
import "./Level.css";

type LevelFiles = {
  html?: string;
  css?: string;
  js?: string;
  instructions?: string;
};

const syntaxLinter = linter((view) => {
  const code = view.state.doc.toString();
  try {
    parse(code, { ecmaVersion: 2020 });
    return [];
  } catch (err: any) {
    return [
      {
        from: 0,
        to: view.state.doc.length,
        severity: "error",
        message: err.message,
      },
    ];
  }
});

export default function Level() {
  const { levelName } = useParams<{ levelName: string }>();
  const [files, setFiles] = useState<LevelFiles>({});
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [TestFuncCode, setTestFuncCode] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load level files and test function
  useEffect(() => {
    if (!levelName) return;
    const safe = levelName.replace(/[^a-zA-Z0-9_-]/g, "");
    const base = `/levels/${safe}`;

    const loadFiles = async () => {
      const newFiles: LevelFiles = {};

      const tryFetch = async (path: string) => {
        try {
          const res = await fetch(path);
          if (res.ok) return await res.text();
        } catch {}
        return undefined;
      };

      const htmlText = await tryFetch(`${base}/index.html`);
      if (
        htmlText &&
        (htmlText.trim().toLowerCase().startsWith("<!doctype") ||
          htmlText.trim().toLowerCase().startsWith("<html"))
      ) {
        newFiles.html = htmlText;
      }

      const cssText = await tryFetch(`${base}/style.css`);
      if (
        cssText &&
        !cssText.trim().toLowerCase().startsWith("<!doctype") && // Need to check this, as Vite returns an HTML file when requesting a non-existent file
        !cssText.trim().toLowerCase().startsWith("<html")
      ) {
        newFiles.css = cssText;
      }

      const jsText = await tryFetch(`${base}/index.js`);
      if (
        jsText &&
        !jsText.trim().toLowerCase().startsWith("<!doctype") &&
        !jsText.trim().toLowerCase().startsWith("<html")
      ) {
        newFiles.js = jsText;
      }

      const mdText = await tryFetch(`${base}/instructions.md`);
      if (mdText) newFiles.instructions = mdText;

      setFiles(newFiles);
      setHtmlCode(newFiles.html || "");
      setCssCode(newFiles.css || "");
      setJsCode(newFiles.js || "");
    };

    const loadTestFunc = async () => {
      try {
        const mod = await import(`../tests/${safe}.ts`);
        if (mod?.runTest) setTestFuncCode(mod.runTest.toString());
      } catch {
        console.warn("No test for level", safe);
        setTestFuncCode(null);
      }
    };

    loadFiles();
    loadTestFunc();
  }, [levelName]);

  // Receive test results from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === "test-result") setTestResult(e.data.result);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Update iframe preview
  useEffect(() => {
    if (!iframeRef.current) return;
    const blob = makeHtmlBlob(htmlCode, cssCode, jsCode, TestFuncCode);
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [htmlCode, cssCode, jsCode, TestFuncCode]);

  const runTest = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "run-test" }, "*");
  };

  return (
    <div className="level-container">
      <h2>{levelName}</h2>

      {files.instructions && (
        <div className="instructions">
          <ReactMarkdown>{files.instructions}</ReactMarkdown>
        </div>
      )}

      <h3>HTML</h3>
      <CodeMirror value={htmlCode} height="150px" extensions={[html()]} onChange={setHtmlCode} />

      {files.css && (
        <>
          <h3>CSS</h3>
          <CodeMirror value={cssCode} height="120px" extensions={[css()]} onChange={setCssCode} />
        </>
      )}

      {files.js && (
        <>
          <h3>JS</h3>
          <CodeMirror
            value={jsCode}
            height="140px"
            extensions={[javascript(), lintGutter(), syntaxLinter]}
            onChange={(v) => setJsCode(v)}
          />
        </>
      )}

      <button className="run-test" onClick={runTest}>
        Run Test
      </button>

      <iframe ref={iframeRef} className="preview" sandbox="allow-scripts" title="Preview" />

      {testResult && (
        <div className="test-result">
          <h3>Test Result</h3>
          <pre className="wrap">{testResult.message}</pre>
        </div>
      )}
    </div>
  );
}
