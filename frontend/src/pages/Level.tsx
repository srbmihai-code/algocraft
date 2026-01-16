import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Markdown from "../components/Markdown";
import { usePrevNextLevel } from "../hooks/usePrevNextLevel";
import { useLevelFiles } from "../hooks/useLevelfFiles";
import { useUserCompletion } from "../hooks/useUserCompletion";
import { useSkipLevelModal } from "../hooks/useSkipLevelModal";
import { useLevelRunner } from "../hooks/useLevelRunner";
import { LevelHeader } from "../components/LevelHeader";
import { EditorSection } from "../components/EditorSection";
import { SkipLevelModal } from "../components/SkipLevelModal";
import getNamesFromURLs from "../utils/getNamesFromURL";

import "./Level.css";
import { getApiBase } from "../utils/apiBase";

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

  const { prevLevel, nextLevel } = usePrevNextLevel(chapterURL, levelURL);
  const navigate = useNavigate();
  const { username, isCompleted, setIsCompleted } = useUserCompletion({ levelURL });

  const files = useLevelFiles({ chapterName: chapterURL, levelURL, setTestFuncCode, setInputTestFuncCode });

  useEffect(() => {
    if (!files) return;
    if (files.html) setHtmlCode(files.html);
    if (files.css) setCssCode(files.css);
    if (files.js) setJsCode(files.js);
  }, [files]);

  const { showSkipModal, confirmSkip } = useSkipLevelModal(prevLevel?.levelURL ?? null);
  const cancelSkip = () => navigate(-1);

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

  const fetchQuestions = async () => {
    if (!chapterURL || !levelURL) return;
    try {
      const res = await fetch(
        `${getApiBase()}/questions?chapterName=${encodeURIComponent(chapterURL)}&levelName=${encodeURIComponent(levelURL)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) setQuestions(data.questions);
    } catch {
      //
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [chapterURL, levelURL]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { chapterName, levelName } = getNamesFromURLs(chapterURL, levelURL);

  return (
    <div className="level-container">
      {chapterURL &&  <LevelHeader
        {...{
          username,
          isCompleted,
          chapterName,
          levelName,
          prevLevel,
          nextLevel,
          htmlCode,
          cssCode,
          jsCode,
          questions,
          chapterURL
        }}
      />}


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
            onRun={(TestFuncCode || InputTestFuncCode) ? runTest : finishLevel}
            runLabel={(TestFuncCode || InputTestFuncCode) ? "Rulează testul" : "Finalizează"}
          />
        </main>


        <aside className="level-right">
          <iframe
            ref={previewIframeRef}
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
        </aside>
      </div>

      <iframe
        ref={iframeRef}
        className="hidden-iframe"
        sandbox="allow-scripts"
        title="Test Runner"
        src="about:blank"
      />

      <SkipLevelModal
        visible={showSkipModal}
        onConfirm={confirmSkip}
        onCancel={cancelSkip}
      />
    </div>
  );
}
