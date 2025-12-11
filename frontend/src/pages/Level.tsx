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
import { getApiBase } from "../utils/apiBase";

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
  const { chapterName, levelURL } = useParams<{ chapterName: string; levelURL: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<LevelFiles>({});
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [TestFuncCode, setTestFuncCode] = useState<string | null>(null);
  const [InputTestFuncCode, setInputTestFuncCode] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [runtimeError, setRuntimeError] = useState<{ message: string; line: number | null } | null>(null);
  const [runtimeErrorLive, setRuntimeErrorLive] = useState<{ message: string; line: number | null } | null>(null);
  const [hasRunTest, setHasRunTest] = useState(false);

  const [username, setUsername] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [prevLevel, setPrevLevel] = useState<string | null>(null);
  const [nextLevel, setNextLevel] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    const chapter = levelsData.find((c) => c.chapterURL === chapterName);
    const index = chapter?.levels.findIndex((l) => l.levelURL === levelURL) ?? -1;
    setPrevLevel(index > 0 ? chapter!.levels[index - 1].levelURL : null);
    setNextLevel(index < (chapter?.levels.length ?? 0) - 1 ? chapter!.levels[index + 1].levelURL : null);
  }, [chapterName, levelURL]);

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
    setFiles({});
    setHtmlCode("");
    setCssCode("");
    setJsCode("");
    setTestFuncCode(null);
    setInputTestFuncCode(null);
    setTestResult(null);
    setRuntimeError(null);
    setRuntimeErrorLive(null);
    setHasRunTest(false);
    setIsCompleted(false);
    if (!chapterName || !levelURL) return;

    const safeChapter = chapterName.replace(/[^a-zA-Z0-9_-]/g, "");
    const safeLevel = levelURL.replace(/[^a-zA-Z0-9_-]/g, "");
    
    const base = `/${safeChapter}/${safeLevel}`;
    console.log(base)
    const cookieKey = `level_${safeChapter}_${safeLevel}`;
    const loadFiles = async () => {
      const newFiles: LevelFiles = {};

      const tryFetch = async (path: string) => {
        try {
          const res = await fetch(path);
          if (res.ok) return filterOutViteFiles(await res.text());
        } catch {}
        return undefined;
      };

      // Load from cookie if available
      const cookieData = getCookie(cookieKey);
      if (cookieData) {
        try {

          const parsed = JSON.parse(cookieData);
          if (parsed.html) newFiles.html = filterOutViteFiles(parsed.html);
          if (parsed.css) newFiles.css = filterOutViteFiles(parsed.css);
          if (parsed.js) newFiles.js = filterOutViteFiles(parsed.js);
        } catch {}
      }

      // Fetch files from server if not in cookie
      const htmlText = await tryFetch(`${base}/index.html`);

      if (!newFiles.html && htmlText) newFiles.html = htmlText;
      const cssText = await tryFetch(`${base}/style.css`);
      if (!newFiles.css && cssText) newFiles.css = cssText;
      const jsText = await tryFetch(`${base}/index.js`);
      if (!newFiles.js && jsText) newFiles.js = jsText;
      const mdText = await tryFetch(`${base}/instructions.md`);
      if (mdText) newFiles.instructions = mdText;

      const testText = await tryFetch(`${base}/test.js`);
      if (testText) setTestFuncCode(testText); 
      const inputTestText = await tryFetch(`${base}/userInputTest.js`);
      if (inputTestText) setInputTestFuncCode(inputTestText);

      setFiles(newFiles);
      setHtmlCode(newFiles.html || "");
      setCssCode(newFiles.css || "");
      setJsCode(newFiles.js || "");
    };

    const fetchUserAndCompletion = async () => {
      try {
        const meRes = await fetch(`${getApiBase()}/me`, { credentials: "include" });
        const meData = await meRes.json();
        if (meData.success) {
          setUsername(meData.username);

          const completedRes = await fetch(`${getApiBase()}/completed-levels`, { credentials: "include" });
          const completedData = await completedRes.json();
          if (completedData.success) {
            setIsCompleted(
              completedData.levels.some((l: any) => l.level_name === levelURL)
            );
          }
        }
      } catch {}
    };

    loadFiles();
    fetchUserAndCompletion();
  }, [chapterName, levelURL]);

  useEffect(() => {
    if (!chapterName || !levelURL) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const data = JSON.stringify({ html: htmlCode, css: cssCode, js: jsCode });
      setCookie(`level_${chapterName}_${levelURL}`, data);

      const iframe = iframeRef.current;
      if (iframe?.contentWindow) {
        const blob = makeHtmlBlob(htmlCode, cssCode, jsCode, TestFuncCode);
        const url = URL.createObjectURL(blob);
        setRuntimeErrorLive(null);

        iframe.contentWindow.location.replace(url);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [htmlCode, cssCode, jsCode, TestFuncCode, chapterName, levelURL]);

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

        if (e.data.result?.pass && username && !isCompleted) {
          fetch(`${getApiBase()}/complete-level`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level_name: levelURL }),
          })
            .then(() => setIsCompleted(true))
            .catch(console.error);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [runtimeErrorLive, username, isCompleted, levelURL]);

  const runInputTest = (code: string, html: string): TestResult => {
    try {
      const testFunc = new Function("html", code + "\nreturn runTest(html);") as (html: string) => TestResult;
      return testFunc(html);
    } catch (err: any) {
      return { pass: false, message: `❌ Eroare la rularea testului: ${err.message}` };
    }
  };

  const runTest = () => {
    setHasRunTest(true);
    setTestResult(null);
    setRuntimeError(null);

    if (runtimeErrorLive) {
      setRuntimeError(runtimeErrorLive);
      setTestResult(null);
      return;
    }

    if (TestFuncCode) {
      iframeRef.current?.contentWindow?.postMessage({ type: "run-test" }, "*");
    } else if (InputTestFuncCode) {
      const result = runInputTest(InputTestFuncCode, htmlCode);
      setTestResult(result);
    }
    else {
      finishLevel()
    }
  };

  const finishLevel = async () => {
    if ((!InputTestFuncCode  || !TestFuncCode) && username && !isCompleted) {
      await fetch(`${getApiBase()}/complete-level`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level_name: levelURL }),
      });
      setIsCompleted(true);
    }
  };

  return (
    <div className="level-container">
      {username && <p>Bine ai venit, {username}!</p>}
      {isCompleted && <span className="completed-label">Rezolvat ✔</span>}

      {files.instructions && (
        <div className="instructions">
          <MarkdownWithSpoilers content={files.instructions} />
        </div>
      )}

      {files.html && (
        <>
          <h3>HTML</h3>
          <CodeMirror value={htmlCode} height="350px" extensions={[html()]} onChange={setHtmlCode} />
        </>
      )}
      {files.css && (
        <>
          <h3>CSS</h3>
          <CodeMirror value={cssCode} height="320px" extensions={[css()]} onChange={setCssCode} />
        </>
      )}
      {files.js && (
        <>
          <h3>JS</h3>
          <CodeMirror
            value={jsCode}
            height="340px"
            extensions={[javascript(), lintGutter(), syntaxLinter]}
            onChange={setJsCode}
          />
        </>
      )}

      <div className="level-buttons">
        <button onClick={() => navigate("/levels")}>Niveluri</button>
        {prevLevel && (
          <button onClick={() => navigate(`/level/${chapterName}/${prevLevel}`)}>
            Nivelul precedent
          </button>
        )}
        {nextLevel && (
          <button onClick={() => navigate(`/level/${chapterName}/${nextLevel}`)}>
            Nivelul următor
          </button>
        )}
      </div>

      {(TestFuncCode || InputTestFuncCode) ? (
        <button className="run-test" onClick={runTest}>
          Rulează testul
        </button>
      ) : (
        <button className="run-test" onClick={finishLevel}>
          Finalizează
        </button>
      )}

      <iframe
        ref={iframeRef}
        className={`preview ${!htmlCode && "hidden"}`}
        sandbox="allow-scripts"
        title="Previzualizare"
        src="about:blank"
      />

      {hasRunTest && runtimeError && (
        <div className="test-result error">
          <h3>Eroare la rulare</h3>
          <pre className="wrap">{runtimeError.message}</pre>
        </div>
      )}
      {hasRunTest && testResult && (
        <div className="test-result">
          <h3>Rezultatul testului</h3>
          <pre className="wrap">{testResult.message}</pre>
        </div>
      )}
    </div>
  );
}
