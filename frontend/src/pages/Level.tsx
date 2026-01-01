import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { lintGutter } from "@codemirror/lint";
import { makeHtmlBlob } from "../utils/makeHtmlBlob";
import Markdown from "../components/Markdown";
import levelsData from "../utils/levels.json";
import type { TestResult, LevelFiles } from "../utils/types";
import "./Level.css";
import { getApiBase } from "../utils/apiBase";
import filterOutViteFiles from "../utils/filterOutViteFiles";
import setCookie from "../utils/setCookie";
import getCookie from "../utils/getCookie";
import runInputTest from "../utils/runInputTest";
import syntaxLinter from "../utils/syntaxLinter";
import { useNavigate } from "react-router-dom";

export default function Level() {
  const { chapterName, levelURL } = useParams<{ chapterName: string; levelURL: string }>();
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

  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipLevelConfirmed, setSkipLevelConfirmed] = useState(getCookie("skipLevelConfirmation") === "true");
  const navigate = useNavigate();

  const iframeRef = useRef<HTMLIFrameElement>(null); // hidden iframe for tests
  const previewIframeRef = useRef<HTMLIFrameElement>(null); // visible preview iframe
  const debounceRef = useRef<number | null>(null);

  // Determine prev/next level
  useEffect(() => {
    const chapter = levelsData.find((c) => c.chapterURL === chapterName);
    const index = chapter?.levels.findIndex((l) => l.levelURL === levelURL) ?? -1;
    setPrevLevel(index > 0 ? chapter!.levels[index - 1].levelURL : null);
    setNextLevel(index < (chapter?.levels.length ?? 0) - 1 ? chapter!.levels[index + 1].levelURL : null);
  }, [chapterName, levelURL]);

  // Check previous level completion for skip modal
  useEffect(() => {
    if (!prevLevel) return;
    if (skipLevelConfirmed) return;

    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/completed-levels`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          const completedLevels = data.levels.map((l: any) => l.level_name);
          const prevCompleted = completedLevels.includes(prevLevel);

          if (!prevCompleted) {
            setShowSkipModal(true);
          } else {
            setShowSkipModal(false);
          }
        }
      } catch {

      }
    })();
  }, [prevLevel, chapterName]);


  const confirmSkip = () => {
    setCookie("skipLevelConfirmation", "true", 365);
    setSkipLevelConfirmed(true);
    setShowSkipModal(false);
  };

  const cancelSkip = () => {
     navigate(-1);
  };

  // Load files from cookie/server and user completion
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
    const cookieKey = `level_${safeChapter}_${safeLevel}`;

    const loadFiles = async () => {
      const newFiles: LevelFiles = {};
      const tryFetch = async (path: string) => {
        try {
          const res = await fetch(path);
          if (res.ok) return filterOutViteFiles(await res.text());
        } catch { }
        return undefined;
      };

      const cookieData = getCookie(cookieKey);
      if (cookieData) {
        try {
          const parsed = JSON.parse(cookieData);
          if (parsed.html) newFiles.html = filterOutViteFiles(parsed.html);
          if (parsed.css) newFiles.css = filterOutViteFiles(parsed.css);
          if (parsed.js) newFiles.js = filterOutViteFiles(parsed.js);
        } catch { }
      }

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
            setIsCompleted(completedData.levels.some((l: any) => l.level_name === levelURL));
          }
        }
      } catch { }
    };

    loadFiles();
    fetchUserAndCompletion();
  }, [chapterName, levelURL]);

  // Update iframes & cookies on code change
  useEffect(() => {
    if (!chapterName || !levelURL) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const data = JSON.stringify({ html: htmlCode, css: cssCode, js: jsCode });
      setCookie(`level_${chapterName}_${levelURL}`, data);

      if (iframeRef.current?.contentWindow) {
        const blob = makeHtmlBlob(htmlCode, cssCode, jsCode, TestFuncCode);
        const url = URL.createObjectURL(blob);
        setRuntimeErrorLive(null);
        iframeRef.current.contentWindow.location.replace(url);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      if (previewIframeRef.current?.contentWindow) {
        const blob = makeHtmlBlob(htmlCode, cssCode, jsCode, null);
        const url = URL.createObjectURL(blob);
        previewIframeRef.current.contentWindow.location.replace(url);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [htmlCode, cssCode, jsCode, TestFuncCode, chapterName, levelURL]);

  // Handle runtime errors & test results
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
          }).then(() => setIsCompleted(true)).catch(console.error);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [runtimeErrorLive, username, isCompleted, levelURL]);

  // Run Test
  const runTest = () => {
    setHasRunTest(true);
    setTestResult(null);
    setRuntimeError(null);

    if (runtimeErrorLive) {
      setRuntimeError(runtimeErrorLive);
      setTestResult(null);
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
      const result = runInputTest(InputTestFuncCode, htmlCode);
      setTestResult(result);
    } else {
      finishLevel();
    }
  };

  const finishLevel = async () => {
    if ((!InputTestFuncCode || !TestFuncCode) && username && !isCompleted) {
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
      {username ? <p>Bine ai venit, {username}!</p> : <p> <Link to="/auth">Loghează-te</Link> pentru a-ți salva progresul</p>}
      {isCompleted && <span className="completed-label">Rezolvat ✔</span>}

      {files.instructions && (
        <div className="instructions">
          <Markdown content={files.instructions} />
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
          <CodeMirror value={jsCode} height="340px" extensions={[javascript(), lintGutter(), syntaxLinter]} onChange={setJsCode} />
        </>
      )}

      <div className="level-buttons">
        <Link to="/levels" className="btn">
          Niveluri
        </Link>
        {prevLevel && (
          <Link to={`/level/${chapterName}/${prevLevel}`} className="btn">
            Nivelul precedent
          </Link>
        )}
        {nextLevel && (
          <Link to={`/level/${chapterName}/${nextLevel}`} className="btn">
            Nivelul următor
          </Link>
        )}
      </div>

      {(TestFuncCode || InputTestFuncCode) ? (
        <button className="run-test" onClick={runTest}>Rulează testul</button>
      ) : (
        <button className="run-test" onClick={finishLevel}>Finalizează</button>
      )}

      <iframe ref={previewIframeRef} className={`preview ${!htmlCode && "hidden"}`} sandbox="allow-scripts" title="Previzualizare" src="about:blank" />

      <iframe
        ref={iframeRef}
        className="hidden-iframe"
        sandbox="allow-scripts"
        title="Test Runner"
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

      {showSkipModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nivelul precedent nu a fost completat</h3>
            <p>Este recomandat să finalizezi nivelul anterior înainte de a trece mai departe.</p>
            <div className="modal-buttons">
              <button className="btn cancel" onClick={cancelSkip}>Înapoi</button>
              <button className="btn confirm" onClick={confirmSkip}>Sari peste</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
