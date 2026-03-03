import { useState } from "react";
import { getApiBase } from "../utils/apiBase";
import Markdown from "./Markdown";

interface Props {
  chapterURL?: string;
  levelURL?: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  instructions?: string;
  mode?: "question" | "ai";
  onClose: () => void;
  onSuccess?: () => void;
}

export function AskQuestionModal({
  chapterURL,
  levelURL,
  htmlCode,
  cssCode,
  jsCode,
  instructions,
  mode = "question",
  onClose,
  onSuccess,
}: Props) {
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  const submitQuestion = async () => {
    setError("");
    setMessage("");
    setAiAnswer("");

    if (!question.trim()) {
      setError("Intrebarea nu poate fi goala.");
      return;
    }

    const isAiMode = mode === "ai";
    const endpoint = isAiMode ? "/ask_ai" : "/questions";
    const payload = isAiMode
      ? {
          chapterName: chapterURL,
          levelName: levelURL,
          question,
          htmlCode,
          cssCode,
          jsCode,
          instructions: instructions ?? "",
        }
      : {
          chapterName: chapterURL,
          levelName: levelURL,
          question,
          htmlCode,
          cssCode,
          jsCode,
        };

    try {
      console.log("AskQuestionModal request", {
        endpoint: `${getApiBase()}${endpoint}`,
        payload,
      });

      const res = await fetch(`${getApiBase()}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        if (isAiMode) {
          setAiAnswer(typeof data.answer === "string" ? data.answer : "");
          setMessage("Raspunsul AI a fost primit.");
        } else {
          setMessage("Intrebarea a fost trimisa cu succes.");
        }
        setQuestion("");
        if (onSuccess) onSuccess();
      } else {
        setError(
          data.message ||
            (isAiMode
              ? "Eroare la trimiterea intrebarii catre AI."
              : "Eroare la trimiterea intrebarii.")
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        isAiMode
          ? "Eroare la trimiterea intrebarii catre AI."
          : "Eroare la trimiterea intrebarii."
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>
          {mode === "ai"
            ? "Ai o intrebare pentru AI la acest nivel?"
            : "Ai o intrebare pentru acest nivel?"}
        </h3>
        <textarea
          placeholder={
            mode === "ai"
              ? "Scrie intrebarea ta pentru AI aici..."
              : "Scrie intrebarea ta aici..."
          }
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          className="modal-textarea"
        />
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        {mode === "ai" && aiAnswer && <Markdown content={aiAnswer} />}
        <div className="modal-actions">
          <button className="header-btn secondary" onClick={onClose}>
            Inchide
          </button>
          <button className="header-btn" onClick={submitQuestion}>
            {mode === "ai" ? "Trimite la AI" : "Trimite"}
          </button>
        </div>
      </div>
    </div>
  );
}
