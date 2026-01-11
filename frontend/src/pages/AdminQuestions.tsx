import { useEffect, useState } from "react";
import { getApiBase } from "../utils/apiBase";
import { Link } from "react-router-dom";

export default function AdminQuestions() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [answerMap, setAnswerMap] = useState<{ [key: number]: string }>({});
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading

    useEffect(() => {
        // Check if user is admin by hitting /me
        fetch(`${getApiBase()}/me`, { credentials: "include" })
          .then(res => res.json())
          .then(data => {
              if (data.success && data.isAdmin) {
                  setIsAdmin(true);
                  // Fetch all questions
                  fetch(`${getApiBase()}/admin/questions`, { credentials: "include" })
                    .then(res => res.json())
                    .then(qData => {
                        if (qData.success) setQuestions(qData.questions);
                    });
              } else {
                  setIsAdmin(false);
              }
          })
          .catch(() => setIsAdmin(false));
    }, []);

    const submitAnswer = async (id: number) => {
        if (!answerMap[id]) return;
        await fetch(`${getApiBase()}/admin/answer`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId: id, answer: answerMap[id] }),
        });
        window.location.reload();
    };

    // Loading state
    if (isAdmin === null) return <p>Loading...</p>;

    // Forbidden for non-admins
    if (!isAdmin)
        return (
          <div style={{ padding: 20 }}>
              <h2>Forbidden</h2>
              <p>Nu ai acces la această pagină.</p>
              <Link to="/levels">← Înapoi</Link>
          </div>
        );

    return (
      <div style={{ padding: 20 }}>
          <Link to="/levels">← Înapoi</Link>
          <h2>Întrebări utilizatori</h2>

          {questions.map(q => (
            <div key={q.id} style={{ border: "1px solid #444", padding: 15, marginBottom: 20 }}>
                <p><strong>User:</strong> {q.username}</p>
                <p><strong>Capitol:</strong> {q.chapter_name}</p>
                <p><strong>Nivel:</strong> {q.level_name}</p>
                <p><strong>Întrebare:</strong> {q.question}</p>
                <p><strong>Creat:</strong> {q.created_at}</p>

                <details>
                    <summary>Cod utilizator</summary>
                    <pre>{q.html_code}</pre>
                    <pre>{q.css_code}</pre>
                    <pre>{q.js_code}</pre>
                </details>

                {q.answer ? (
                  <>
                      <p><strong>Răspuns admin:</strong> {q.answer}</p>
                      <p><em>{q.answered_at}</em></p>
                  </>
                ) : (
                  <>
              <textarea
                placeholder="Scrie răspuns..."
                onChange={e => setAnswerMap({ ...answerMap, [q.id]: e.target.value })}
              />
                      <br />
                      <button onClick={() => submitAnswer(q.id)}>Răspunde</button>
                  </>
                )}
            </div>
          ))}
      </div>
    );
}
