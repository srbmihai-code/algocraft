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
  levelURL: string | undefined;
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
  questions,
  chapterURL,
  levelURL,
}: Props) {
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const safeChapterName = chapterName ?? "Capitol";
  const safeLevelName = levelName ?? "Nivel";
  const fullTitle = `${safeChapterName}: ${safeLevelName}`;
  const headerTitle = fullTitle.length > 44 ? safeLevelName : fullTitle;

  return (
    <>
      <header className="level-header-bar">
        <div className="level-header-left">
          <Link to={"/"} className="site-link">
            <img src={logo} alt="Logo" className="level-logo" />
            <span className="site-name">AlgoCraft</span>
          </Link>
          {username ? (
            <p>Bine ai venit, <strong>{username}</strong></p>
          ) : null}

          {isCompleted && <span className="completed-label">Rezolvat ✔</span>}
        </div>

        <div className="level-header-center">
          <h2>{headerTitle}</h2>
        </div>

        <div
          className={`level-header-right${
            username && questions.length > 0 ? " has-questions" : ""
          }`}
        >
          <LevelNavigation prevLevel={prevLevel} nextLevel={nextLevel} currentURL={chapterURL}/>
          {username ? (
            <>
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
            </>
          ) : (
            <Link to="/auth" className="header-btn">
              Autentificare / Creare cont
            </Link>
          )}
        </div>
      </header>

      {showQuestionModal && (
        <AskQuestionModal
          chapterURL={chapterURL}
          levelURL={levelURL}
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
    </>
  );
}
