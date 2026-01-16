import { useState } from "react";
import { Link } from "react-router-dom";
import { LevelNavigation } from "./LevelNavigation";
import { AskQuestionModal } from "./AskQuestionModal";
import { ViewQuestionsModal } from "./ViewQuestionsModal";
import type { Question } from "../utils/types";
import logo from "../assets/light-bulb.png";

interface NavLevel {
  chapterURL: string;
  levelURL: string;
}

interface Props {
  username: string | null;
  isCompleted: boolean;
  chapterName?: string;
  levelName?: string;
  prevLevel: NavLevel | null;
  nextLevel: NavLevel | null;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  chapterURL: string;
  questions: Question[];
}

export function LevelHeader({
  username,
  isCompleted,
  chapterName,
  levelName,
  prevLevel,
  nextLevel,
  htmlCode,
  cssCode,
  jsCode,
  questions
}: Props) {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);

  return (
    <header className="level-header-bar">
      <div className="level-header-left">
        <Link to={"/"} className="site-link">
          <img src={logo} alt="Logo" className="level-logo" />
          <span className="site-name">AlgoCraft</span>
        </Link>
        {username ? (
          <p>Bine ai venit, <strong>{username}</strong></p>
        ) : (
          <p>
            <Link to="/auth" className="header-btn">Loghează-te pentru a-ți salva progresul</Link>
          </p>
        )}

        {isCompleted && <span className="completed-label">Rezolvat ✔</span>}
      </div>

      <div className="level-header-center">
        <h2>
          {chapterName ?? "Capitol"}: {levelName ?? "Nivel"}
        </h2>
      </div>

      <div className="level-header-right">
        <LevelNavigation prevLevel={prevLevel} nextLevel={nextLevel} />

        <button
          className="header-btn"
          onClick={() => setShowQuestionModal(true)}
        >
          Pune o întrebare
        </button>

        {questions.length > 0 && (
          <button
            className="header-btn secondary"
            onClick={() => setShowQuestionsModal(true)}
          >
            Vezi întrebările
          </button>
        )}
      </div>

      {showQuestionModal && (
        <AskQuestionModal
          chapterName={chapterName}
          levelName={levelName}
          htmlCode={htmlCode}
          cssCode={cssCode}
          jsCode={jsCode}
          onClose={() => setShowQuestionModal(false)}
          onSuccess={() => {}}
        />
      )}

      {showQuestionsModal && (
        <ViewQuestionsModal
          questions={questions}
          onClose={() => setShowQuestionsModal(false)}
        />
      )}
    </header>
  );
}
