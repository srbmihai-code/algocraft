import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { linter, lintGutter } from "@codemirror/lint";
import { parse } from "acorn";
import { makeHtmlBlob } from "../utils/makeHtmlBlob";
import MarkdownWithSpoilers from "../components/MarkdownWithSpoilers";
import levelsData from "../utils/levels.json";
import type { TestResult } from "../tests/types";
import "./Level.css";

type LevelFiles = { html?: string; css?: string; js?: string; instructions?: string };

const filterOutViteFiles = (text: string | undefined | null) => {
  if (!text) return "";
  if (text.includes('<script type="module" src="/@vite/client">') || text.includes('<div id="root"></div>')) return "";
  return text;
};

const syntaxLinter = linter((view) => {
  const code = view.state.doc.toString();
  try {
    parse(code, { ecmaVersion: 2020 });
    return [];
  } catch (err: any) {
    return [{ from: 0, to: view.state.doc.length, severity: "error", message: err.message }];
  }
});

export default function Level() {
  const { levelName } = useParams<{ levelName: string }>();
  const navigate = useNavigate();

  const [files, setFiles] = useState<LevelFiles>({});
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [TestFuncCode, setTestFuncCode] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [runtimeError, setRuntimeError] = useState<{ message: string; line: number | null } | null>(null);
  const [runtimeErrorLive, setRuntimeErrorLive] = useState<{ message: string; line: number | null } | null>(null);
  const [hasRunTest, setHasRunTest] = useState(false);

  const [username, setUsername] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<number | null>(null);

  const currentIndex = levelsData.findIndex(l => l.levelName === levelName);
  const prevLevel = currentIndex > 0 ? levelsData[currentIndex - 1].levelName : null;
  const nextLevel = currentIndex < levelsData.length - 1 ? levelsData[currentIndex + 1].levelName : null;

  const setCookie = (name: string, value: string, days = 365) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    const raw = match ? decodeURIComponent(match[2]) : null;
    return filterOutViteFiles(raw);
  };

  useEffect(() => {
    if (!levelName) return;
    const safe = levelName.replace(/[^a-zA-Z0-9_-]/g, "");
    const base = `/levels/${safe}`;
    const cookieKey = `level_${safe}`;

    const loadFiles = async () => {
      const newFiles: LevelFiles = {};

      const tryFetch = async (path: string) => {
        try {
          const res = await fetch(path);
          if (res.ok) return filterOutViteFiles(await res.text());
        } catch {}
        return undefined;
      };

      const cookieData = getCookie(cookieKey);
      if (cookieData) {
        try {
          const parsed = JSON.parse(cookieData);
          if (parsed.html) newFiles.html = filterOutViteFiles(parsed.html);
          if (parsed.css) newFiles.css = filterOutViteFiles(parsed.css);
          if (parsed.js) newFiles.js = filterOutViteFiles(parsed.js);
        } catch {}
      }

      const htmlText = await tryFetch(`${base}/index.html`);
      if (!newFiles.html && htmlText) newFiles.html = htmlText;

      const cssText = await tryFetch(`${base}/style.css`);
      if (!newFiles.css && cssText) newFiles.css = cssText;

      const jsText = await tryFetch(`${base}/index.js`);
      if (!newFiles.js && jsText) newFiles.js = jsText;

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
      } catch {}
    };

    const fetchUserAndCompletion = async () => {
      try {
        const meRes = await fetch("http://localhost:3001/api/me", { credentials: "include" });
        const meData = await meRes.json();
        if (meData.success) {
          setUsername(meData.username);

          const completedRes = await fetch("http://localhost:3001/api/completed-levels", { credentials: "include" });
          const completedData = await completedRes.json();
          if (completedData.success) {
            setIsCompleted(completedData.levels.some((l: any) => l.level_name === levelName));
          }
        }
      } catch {}
    };

    loadFiles();
    loadTestFunc();
    fetchUserAndCompletion();
  }, [levelName]);

  useEffect(() => {
    if (!levelName) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const data = JSON.stringify({ html: htmlCode, css: cssCode, js: jsCode });
      setCookie(`level_${levelName}`, data);

      if (iframeRef.current) {
        const blob = makeHtmlBlob(htmlCode, cssCode, jsCode, TestFuncCode);
        const url = URL.createObjectURL(blob);
        setRuntimeErrorLive(null);
        iframeRef.current.src = url;
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [htmlCode, cssCode, jsCode, TestFuncCode, levelName]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data) return;

      if (e.data.type === "runtime-error") {
        setRuntimeErrorLive({ message: e.data.message || "Eroare necunoscută în timpul rulării", line: e.data.line || null });
      }
      if (e.data.type === "test-result" && !runtimeErrorLive) {
        setTestResult(e.data.result);
        setRuntimeError(null);

        if (e.data.result?.pass && username && !isCompleted) {

          fetch("http://localhost:3001/api/complete-level", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level_name: levelName }),
          })
            .then(() => setIsCompleted(true))
            .catch(console.error);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [runtimeErrorLive, username, isCompleted, levelName]);

  const runTest = () => {
    setHasRunTest(true);
    setTestResult(null);
    setRuntimeError(null);

    if (runtimeErrorLive) {
      setRuntimeError(runtimeErrorLive);
      setTestResult(null);
      return;
    }

    iframeRef.current?.contentWindow?.postMessage({ type: "run-test" }, "*");
  };

  return (
    <div className="level-container">
      <h2>{levelName}</h2>

      {username && <p>Bine ai venit, {username}!</p>}
      {isCompleted && <span className="completed-label">Rezolvat ✔</span>}

      {files.instructions && <div className="instructions"><MarkdownWithSpoilers content={files.instructions} /></div>}

      {files.html && <><h3>HTML</h3><CodeMirror value={htmlCode} height="150px" extensions={[html()]} onChange={setHtmlCode} /></>}
      {files.css && <><h3>CSS</h3><CodeMirror value={cssCode} height="120px" extensions={[css()]} onChange={setCssCode} /></>}
      {files.js && <><h3>JS</h3><CodeMirror value={jsCode} height="340px" extensions={[javascript(), lintGutter(), syntaxLinter]} onChange={setJsCode} /></>}

      <div className="level-buttons">
        <button onClick={() => navigate("/levels")}>Niveluri</button>
        {prevLevel && <button onClick={() => navigate(`/level/${prevLevel}`)}>Nivelul precedent</button>}
        {nextLevel && <button onClick={() => navigate(`/level/${nextLevel}`)}>Nivelul următor</button>}
      </div>

      <button className="run-test" onClick={runTest}>Rulează testul</button>

      <iframe ref={iframeRef} className={`preview ${!htmlCode && 'hidden'}`} sandbox="allow-scripts" title="Previzualizare" />

      {hasRunTest && runtimeError && <div className="test-result error"><h3>Eroare la rulare</h3><pre className="wrap">{runtimeError.message}</pre></div>}
      {hasRunTest && testResult && <div className="test-result"><h3>Rezultatul testului</h3><pre className="wrap">{testResult.message}</pre></div>}
    </div>
  );
}
