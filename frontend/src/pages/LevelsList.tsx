import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import levelsData from "../utils/levels.json";
import htmlIcon from "../assets/html.png";
import cssIcon from "../assets/css.png";
import jsIcon from "../assets/js.png";
import "./LevelsList.css";
import { getApiBase } from "../utils/apiBase";

type Level = {
  levelName: string;
  levelURL: string;
  language: "html" | "css" | "js";
};

type Chapter = {
  chapterURL: string;
  chapterName: string;
  levels: Level[];
};

export default function LevelsList() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        const userRes = await fetch(`${getApiBase()}/me`, {
          credentials: "include",
        });

        if (!userRes.ok) {
          setLoading(false);
          return;
        }

        const userData = await userRes.json();

        if (userData.success) {
          setUsername(userData.username);
          const isAdminFromServer = !!userData.isAdmin;
          setIsAdmin(isAdminFromServer);

          if (!isAdminFromServer) {
            await fetchCompletedLevels();
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const onFocus = () => {
      if (username && !isAdmin) fetchCompletedLevels();
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [username, isAdmin]);

  const getIcon = (language: Level["language"]) => {
    switch (language) {
      case "html":
        return htmlIcon;
      case "css":
        return cssIcon;
      case "js":
        return jsIcon;
      default:
        return "";
    }
  };

  const handleLogout = async () => {
    await fetch(`${getApiBase()}/logout`, {
      method: "POST",
      credentials: "include",
    });

    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    setUsername(null);
    setIsAdmin(false);
    setCompletedLevels([]);
    navigate("/auth");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="levels-container">
      <h2>Lista Niveluri</h2>

      {username ? (
        <div className="user-info">
          <p>Bine ai venit, {username}!</p>

          {isAdmin && (
            <Link to="/admin/questions" className="admin-link">
              Admin – Întrebări
            </Link>
          )}

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => navigate("/auth")}>
          Autentificare / Creare cont
        </button>
      )}

      {chapters.map((chapter, chapterIndex) => (
        <div key={chapterIndex} className="chapter">
          <h3 className="chapter-name">{chapter.chapterName}</h3>

          <ul className="levels-list">
            {chapter.levels.map((level, index) => {
              const isCompleted = completedLevels.includes(
                decodeURIComponent(level.levelURL)
              );

              return (
                <li
                  key={index}
                  className={`level-item ${level.language} ${
                    isCompleted ? "completed" : ""
                  }`}
                >
                  <Link
                    to={`/level/${encodeURIComponent(
                      chapter.chapterURL
                    )}/${encodeURIComponent(level.levelURL)}`}
                    className="level-link"
                  >
                    <img
                      src={getIcon(level.language)}
                      alt={level.language}
                      className="level-icon"
                    />
                    <span className="level-name">{level.levelName}</span>
                    <span className="level-language">
                      {level.language.toUpperCase()}
                    </span>
                    {isCompleted && (
                      <span className="level-status">✔</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
