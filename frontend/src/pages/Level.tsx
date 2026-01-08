import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Markdown from "../components/Markdown";
import { usePrevNextLevel } from "../hooks/usePrevNextLevel";
import { useLevelFiles } from "../hooks/useLevelfFiles";
import { useUserCompletion } from "../hooks/useUserCompletion";
import { useSkipLevelModal } from "../hooks/useSkipLevelModal";
import { useLevelRunner } from "../hooks/useLevelRunner"
import { LevelHeader } from "../components/LevelHeader";
import { EditorSection } from "../components/EditorSection";
import { LevelNavigation } from "../components/LevelNavigation";
import { SkipLevelModal } from "../components/SkipLevelModal";

import "./Level.css";

export default function Level() {
  const { chapterName, levelURL } = useParams<{ chapterName: string; levelURL: string }>();
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [TestFuncCode, setTestFuncCode] = useState<string | null>(null);
  const [InputTestFuncCode, setInputTestFuncCode] = useState<string | null>(null);

  const { prevLevel, nextLevel } = usePrevNextLevel(chapterName, levelURL);
  const navigate = useNavigate();
  const { username, isCompleted, setIsCompleted } = useUserCompletion({ levelURL });

  const files = useLevelFiles({
    chapterName,
    levelURL,
    setTestFuncCode,
    setInputTestFuncCode,
  });

  useEffect(() => {
    if (!files) return;
    if (files.html) setHtmlCode(files.html);
    if (files.css) setCssCode(files.css);
    if (files.js) setJsCode(files.js);
  }, [files]);

  const { showSkipModal, confirmSkip } = useSkipLevelModal(prevLevel);

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
    chapterName,
    levelURL,
    htmlCode,
    cssCode,
    jsCode,
    TestFuncCode,
    InputTestFuncCode,
    username,
    isCompleted,
    setIsCompleted
  });

  return (
    <div className="level-container">
      <LevelHeader username={username} isCompleted={isCompleted} />

      {files.instructions && (
        <div className="instructions">
          <Markdown content={files.instructions} />
        </div>
      )}

      <EditorSection
        htmlCode={files.html ? htmlCode : undefined}
        cssCode={files.css ? cssCode : undefined}
        jsCode={files.js ? jsCode : undefined}
        setHtmlCode={setHtmlCode}
        setCssCode={setCssCode}
        setJsCode={setJsCode}
      />

      <LevelNavigation {...{ chapterName, prevLevel, nextLevel }} />

      {(TestFuncCode || InputTestFuncCode) ? (
        <button className="run-test" onClick={runTest}>Rulează testul</button>
      ) : (
        <button className="run-test" onClick={finishLevel}>Finalizează</button>
      )}

      <iframe ref={previewIframeRef} className={`preview ${!htmlCode && "hidden"}`} sandbox="allow-scripts" title="Previzualizare" src="about:blank" />

      <iframe ref={iframeRef} className="hidden-iframe" sandbox="allow-scripts" title="Test Runner" src="about:blank" />

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

      <SkipLevelModal
        visible={showSkipModal}
        onConfirm={confirmSkip}
        onCancel={cancelSkip}
      />
    </div>
  );
}
