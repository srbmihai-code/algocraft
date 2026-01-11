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
import { LevelNavigation } from "../components/LevelNavigation";
import { SkipLevelModal } from "../components/SkipLevelModal";

import "./Level.css";
import { getApiBase } from "../utils/apiBase";

type Question = {
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
  const { chapterName, levelURL } = useParams<{ chapterName: string; levelURL: string }>();
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");
  const [TestFuncCode, setTestFuncCode] = useState<string | null>(null);
  const [InputTestFuncCode, setInputTestFuncCode] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [questionMessage, setQuestionMessage] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

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

  // Fetch user's questions for this level
  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        `${getApiBase()}/questions?chapterName=${encodeURIComponent(chapterName!)}&levelName=${encodeURIComponent(levelURL!)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (data.success) setQuestions(data.questions);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [chapterName, levelURL]);

  // Submit a new question
  const submitQuestion = async () => {
    setQuestionError("");
    setQuestionMessage("");

    if (!question.trim()) {
      setQuestionError("Întrebarea nu poate fi goală.");
      return;
    }

    try {
      const res = await fetch(`${getApiBase()}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          chapterName,
          levelName: levelURL,
          question,
          htmlCode,
          cssCode,
          jsCode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestionMessage("Întrebarea a fost trimisă cu succes.");
        setQuestion("");
        fetchQuestions(); // Refresh questions after submitting
      } else {
        setQuestionError(data.message || "Eroare la trimiterea întrebării.");
      }
    } catch (err) {
      console.error(err);
      setQuestionError("Eroare la trimiterea întrebării.");
    }
  };

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

      {/* Question form */}
      <div className="question-form">
        <h3>Ai o întrebare pentru acest nivel?</h3>
        <textarea
          placeholder="Scrie întrebarea ta aici..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          style={{ width: "100%", marginBottom: 8 }}
        />
        {questionError && <p className="error">{questionError}</p>}
        {questionMessage && <p className="message">{questionMessage}</p>}
        <button onClick={submitQuestion}>Trimite întrebarea</button>
      </div>

      {/* User's questions with answers */}
      {questions.length > 0 && (
        <div className="user-questions">
          <h3>Întrebările tale pentru acest nivel</h3>
          {questions.map((q) => (
            <div key={q.id} className="question-item">
              <strong>Întrebare:</strong> {q.question}
              <strong>Cod HTML:</strong> <pre>{q.html_code}</pre>
              <strong>Cod CSS:</strong> <pre>{q.css_code}</pre>
              <strong>Cod JS:</strong> <pre>{q.js_code}</pre>
              {q.answer && (
                <p><strong>Răspuns admin ({q.admin_name}):</strong> {q.answer}</p>
              )}
            </div>
          ))}
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
