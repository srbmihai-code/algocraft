import type { Question } from "../utils/types"

interface Props {
  questions: Question[];
  onClose: () => void;
}

export function ViewQuestionsModal({ questions, onClose }: Props) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Întrebările tale pentru acest nivel</h3>
        {questions.map((q) => (
          <div key={q.id} className="question-item">
            <strong>Întrebare:</strong> {q.question}
            <br />
            {q.html_code && (
              <>
                <strong>Cod HTML:</strong>
                <pre>{q.html_code}</pre>
              </>
            )}
            {q.css_code && (
              <>
                <strong>Cod CSS:</strong>
                <pre>{q.css_code}</pre>
              </>
            )}
            {q.js_code && (
              <>
                <strong>Cod JS:</strong>
                <pre>{q.js_code}</pre>
              </>
            )}
            {q.answer && (
              <p>
                <strong>Răspuns admin ({q.admin_name}):</strong> {q.answer}
              </p>
            )}
          </div>
        ))}

        <div className="modal-actions">
          <button className="header-btn secondary" onClick={onClose}>Închide</button>
        </div>
      </div>
    </div>
  );
}
