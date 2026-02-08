import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Markdown from "../components/Markdown";
import { usePrevNextLevel } from "../hooks/usePrevNextLevel";
import { useLevelFiles } from "../hooks/useLevelfFiles";
import { useLevelRunner } from "../hooks/useLevelRunner";
import { LevelHeader } from "../components/LevelHeader";
import { EditorSection } from "../components/EditorSection";
import getNamesFromURLs from "../utils/getNamesFromURL";
import { getApiBase } from "../utils/apiBase";
import "./Level.css";

export type Question = {
  id: number;
  chapter_name: string;
  level_name: string;
  question: string;
  html_code: string | null;
  css_code: string | null;
  js_code: string | null;
  created_at: string;
  answer?: string | null;
  answered_at?: string | null;
  admin_name?: string | null;
};

export default function Level() {
  const { chapterName: chapterURL, levelURL } = useParams<{ chapterName: string; levelURL: string }>();

  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [TestFuncCode, setTestFuncCode] = useState<string | null>(null);
  const [InputTestFuncCode, setInputTestFuncCode] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const { prevLevel, nextLevel } = usePrevNextLevel(chapterURL, levelURL);

  const files = useLevelFiles({
    chapterName: chapterURL,
    levelURL,
    setTestFuncCode,
    setInputTestFuncCode,
  });

  useEffect(() => {
    if (!files) return;
    setHtmlCode(files.html || "");
    setCssCode(files.css || "");
    setJsCode(files.js || "");
  }, [files]);

  useEffect(() => {
    setTestFuncCode(null);
    setInputTestFuncCode(null);
    setHtmlCode("");
    setCssCode("");
    setJsCode("");
  }, [chapterURL, levelURL]);

  useEffect(() => {
    if (authChecked) return;

    fetch(`${getApiBase()}/me`, { credentials: "include" })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.username) setUsername(data.username);
      })
      .finally(() => setAuthChecked(true));
  }, [authChecked]);

  useEffect(() => {
    if (!authChecked || !username || !levelURL) return;

    fetch(`${getApiBase()}/completed-levels`, { credentials: "include" })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.success) {
          setIsCompleted(
            data.levels.some((l: any) => l.level_name === levelURL)
          );
        }
      })
      .catch(() => {});
  }, [authChecked, username, levelURL]);

  useEffect(() => {
    if (!authChecked || !username || !chapterURL || !levelURL) return;

    fetch(
      `${getApiBase()}/questions?chapterName=${encodeURIComponent(chapterURL)}&levelName=${encodeURIComponent(levelURL)}`,
      { credentials: "include" }
    )
      .then(res => (res.ok ? res.json() : null))
      .then(data => { 
        if (data?.success) setQuestions(data.questions);
      })
      .catch(() => {});
  }, [authChecked, username, chapterURL, levelURL]);
  const {
    iframeRef,
    previewIframeRef,
    runtimeError,
    testResult,
    hasRunTest,
    runTest,
    finishLevel,
  } = useLevelRunner({
    chapterName: chapterURL,
    levelURL,
    htmlCode,
    cssCode,
    jsCode,
    TestFuncCode,
    InputTestFuncCode,
    username,
    isCompleted,
    setIsCompleted,
  });

  useEffect(() => {
    if (iframeRef.current) iframeRef.current.src = "about:blank";
    if (previewIframeRef.current) previewIframeRef.current.src = "about:blank";
  }, [chapterURL, levelURL]);

  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [chapterURL, levelURL]);

  const { chapterName, levelName } = getNamesFromURLs(chapterURL, levelURL);
  console.log(username)

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="level-container">
      {chapterURL && (
        <LevelHeader
          username={username}
          isCompleted={isCompleted}
          chapterName={chapterName}
          levelName={levelName}
          prevLevel={prevLevel}
          nextLevel={nextLevel}
          htmlCode={htmlCode}
          cssCode={cssCode}
          jsCode={jsCode}
          questions={questions}
          chapterURL={chapterURL}
          levelURL={levelURL}
        />
      )}

      <div className="level-layout">
        <aside className="level-left">
          {files.instructions && (
            <div className="instructions">
              <Markdown content={files.instructions} />
            </div>
          )}
        </aside>

        <main className="level-center">
          <EditorSection
            htmlCode={files.html ? htmlCode : undefined}
            cssCode={files.css ? cssCode : undefined}
            jsCode={files.js ? jsCode : undefined}
            setHtmlCode={setHtmlCode}
            setCssCode={setCssCode}
            setJsCode={setJsCode}
            onRun={TestFuncCode || InputTestFuncCode ? runTest : finishLevel}
            runLabel={TestFuncCode || InputTestFuncCode ? "Rulează testul" : "Finalizează"}
          />
        </main>

        <aside className="level-right">
          {htmlCode && (
            <iframe
              ref={previewIframeRef}
              className="preview"
              sandbox="allow-scripts"
              title="Previzualizare"
              src="about:blank"
            />
          )}

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
        </aside>
      </div>

      <iframe
        ref={iframeRef}
        className="hidden-iframe"
        sandbox="allow-scripts"
        title="Test Runner"
        src="about:blank"
      />
    </div>
  );
}
``
