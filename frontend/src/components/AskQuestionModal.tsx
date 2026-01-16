import { useState } from "react";
import { getApiBase } from "../utils/apiBase";

interface Props {
  chapterName?: string;
  levelName?: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AskQuestionModal({
  chapterName,
  levelName,
  htmlCode,
  cssCode,
  jsCode,
  onClose,
  onSuccess,
}: Props) {
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitQuestion = async () => {
    setError("");
    setMessage("");

    if (!question.trim()) {
      setError("Întrebarea nu poate fi goală.");
      return;
    }

    try {
      const res = await fetch(`${getApiBase()}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          chapterName,
          levelName,
          question,
          htmlCode,
          cssCode,
          jsCode,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage("Întrebarea a fost trimisă cu succes.");
        setQuestion("");
        if (onSuccess) onSuccess();
      } else {
        setError(data.message || "Eroare la trimiterea întrebării.");
      }
    } catch (err) {
      console.error(err);
      setError("Eroare la trimiterea întrebării.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Ai o întrebare pentru acest nivel?</h3>
        <textarea
          placeholder="Scrie întrebarea ta aici..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
          style={{ width: "100%", marginBottom: 8 }}
        />
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose}>Închide</button>
          <button onClick={submitQuestion}>Trimite</button>
        </div>
      </div>
    </div>
  );
}
