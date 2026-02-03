import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import levelsData from "../utils/levels.json";
import "./LevelsList.css";
import { getApiBase } from "../utils/apiBase";
import htmlIcon from "../assets/html.png";
import cssIcon from "../assets/css.png";
import jsIcon from "../assets/js.png";
import recursivitateIcon from "../assets/recursivitate.png";
import vectoriIcon from "../assets/vectori.png";
import listeIcon from "../assets/liste.png";
import practiciIcon from "../assets/practici-bune.png";
import logo from "../assets/light-bulb.png";
import leftArrow from "../assets/left.png";
import rightArrow from "../assets/right.png";
import messageIcon from "../assets/message.png";


type Level = {
  levelName: string;
  levelURL: string;
  language: "html" | "css" | "js";
};

type Chapter = {
  chapterURL: string;
  chapterName: string;
  chapterDescription: string;
  chapterConcepts: string;
  levels: Level[];
};

const chapterIcons: Record<string, string> = {
  html: htmlIcon,
  css: cssIcon,
  js: jsIcon,
  recursivitate: recursivitateIcon,
  vectori: vectoriIcon,
  liste: listeIcon,
  "practici-bune": practiciIcon,
};

export default function LevelsList() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const chaptersRowRef = useRef<HTMLDivElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [levelQuestionsMap, setLevelQuestionsMap] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();

  const scrollChapters = (direction: -1 | 1) => {
    const row = chaptersRowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * 520, behavior: "smooth" });
  };

  const fetchCompletedLevels = async () => {
    const res = await fetch(`${getApiBase()}/completed-levels`, {
      credentials: "include",
    });
    if (!res.ok) return;

    const data = await res.json();
    if (!data.success) return;

    setCompletedLevels(
      data.levels.map((l: any) => decodeURIComponent(l.level_name))
    );
  };

  useEffect(() => {
    setChapters(levelsData as Chapter[]);

    const fetchUserData = async () => {
      try {
        const res = await fetch(`${getApiBase()}/me`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        if (!data.success) return;

        setUsername(data.username);
        setIsAdmin(!!data.isAdmin);

        if (!data.isAdmin) {
          await fetchCompletedLevels();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!chapters.length) return;
    const chapterParam = searchParams.get("chapter");
    if (!chapterParam) return;
    const match = chapters.find((c) => c.chapterURL === chapterParam);
    if (match) {
      setActiveChapter(match);
    }
  }, [chapters, searchParams]);

  useEffect(() => {
    if (!activeChapter || !username) return;

    const fetchQuestionsForLevels = async () => {
      const results = await Promise.all(
        activeChapter.levels.map(async (level) => {
          try {
            const res = await fetch(
              `${getApiBase()}/questions?chapterName=${encodeURIComponent(
                activeChapter.chapterURL
              )}&levelName=${encodeURIComponent(level.levelURL)}`,
              { credentials: "include" }
            );
            if (!res.ok) return [level.levelURL, false] as const;
            const data = await res.json();
            return [level.levelURL, !!data?.success && data.questions?.length > 0] as const;
          } catch {
            return [level.levelURL, false] as const;
          }
        })
      );

      setLevelQuestionsMap((prev) => {
        const next = { ...prev };
        for (const [levelURL, hasQuestions] of results) {
          next[levelURL] = hasQuestions;
        }
        return next;
      });
    };

    fetchQuestionsForLevels();
  }, [activeChapter, username]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="levels-page">
      <div className="levels-container">
      <div className="levels-header">
        <Link to="/" className="levels-logo-link">
          <img src={logo} alt="Logo" className="levels-logo" />
          <span className="levels-site-name">AlgoCraft</span>
        </Link>

        <h2 className="levels-title">Niveluri</h2>

        <div className="levels-actions">

      {username ? (
        <div className="user-info">
          <p>Bine ai venit, {username}!</p>

          {isAdmin && (
            <Link to="/admin/questions" className="admin-link">
              Admin - Întrebări
            </Link>
          )}

          <button
            onClick={async () => {
              await fetch(`${getApiBase()}/logout`, {
                method: "POST",
                credentials: "include",
              });
              setUsername(null);
              setIsAdmin(false);
              setCompletedLevels([]);
              navigate("/auth");
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => navigate("/auth")}>
          Autentificare / Creare cont
        </button>
      )}

        </div>
      </div>

      <div className="chapters-scroll">
        <button
          type="button"
          className="chapters-scroll-btn left"
          onClick={() => scrollChapters(-1)}
          aria-label="Scroll chapters left"
        >
          <img src={leftArrow} alt="" className="chapters-scroll-icon" />
        </button>

        <div className="chapters-row" ref={chaptersRowRef}>
          {chapters.map((chapter) => {
          const total = chapter.levels.length;
          const completed = chapter.levels.filter((l) =>
            completedLevels.includes(decodeURIComponent(l.levelURL))
          ).length;

          const percent = username
            ? Math.round((completed / total) * 100)
            : 0;
          
          return (
            <div
              key={chapter.chapterURL}
              className={`chapter-card ${
                activeChapter?.chapterURL === chapter.chapterURL
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setActiveChapter(chapter);
                setSearchParams({ chapter: chapter.chapterURL });
              }}
            >
              <img
                src={chapterIcons[chapter.chapterURL]}
                className="chapter-icon"
                alt={chapter.chapterName}
              />

              <h3>{chapter.chapterName}</h3>
              <p className="chapter-description">
                <span>{chapter.chapterDescription}</span>
                <br />
                <br />
                <span>Concepte: {chapter.chapterConcepts}</span>
              </p>
              
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <span className="progress-text">
                {username ? completed : 0}/{total} niveluri
              </span>
            </div>
          );
          })}
        </div>

        <button
          type="button"
          className="chapters-scroll-btn right"
          onClick={() => scrollChapters(1)}
          aria-label="Scroll chapters right"
        >
          <img src={rightArrow} alt="" className="chapters-scroll-icon" />
        </button>
      </div>

      {activeChapter && (
        <div className="levels-section">
          <h3>{activeChapter.chapterName}</h3>

          <div className="levels-grid">
            {activeChapter.levels.map((level, index) => {
              const isCompleted = completedLevels.includes(
                decodeURIComponent(level.levelURL)
              );

              return (
                <Link
                  key={level.levelURL}
                  to={`/level/${encodeURIComponent(
                    activeChapter.chapterURL
                  )}/${encodeURIComponent(level.levelURL)}`}
                  className={`level-card ${level.language} ${
                    isCompleted ? "completed" : ""
                  }`}
                >
                  <span className="level-number">{index + 1}</span>
                  <span className="level-title">{level.levelName}</span>
                  <span className="level-meta">
                    {level.language.toUpperCase()}
                  </span>
                  {levelQuestionsMap[level.levelURL] && (
                    <img
                      src={messageIcon}
                      alt="Intrebari"
                      className="level-message-icon"
                    />
                  )}
                  {isCompleted && (
                    <span className="level-check">✔</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
