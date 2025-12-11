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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setChapters(levelsData as Chapter[]);
    const fetchUserData = async () => {
      try {
        const userRes = await fetch(`${getApiBase()}/me`, {
          credentials: "include",
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success) setUsername(userData.username);

          const levelsRes = await fetch(`${getApiBase()}/completed-levels`, {
            credentials: "include",
          });
          if (levelsRes.ok) {
            const levelsData = await levelsRes.json();
            if (levelsData.success)
              setCompletedLevels(levelsData.levels.map((l: any) => l.level_name));
          }
        }
      } catch (err) {
        console.error("Could not fetch user data or completed levels", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

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
    try {
      await fetch(`${getApiBase()}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUsername(null);
      setCompletedLevels([]);
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="levels-container">
      <h2>Lista Niveluri</h2>
      {username ? (
        <div className="user-info">
          <p>Bine ai venit, {username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => navigate("/auth")}>Autentificare / Creare cont</button>
      )}

      {chapters.map((chapter, chapterIndex) => (
        <div key={chapterIndex} className="chapter">
          <h3 className="chapter-name">{chapter.chapterName}</h3>
          <ul className="levels-list">
            {chapter.levels.map((level, index) => {
              const isCompleted = completedLevels.includes(level.levelURL);
              return (
                <li
                  key={index}
                  className={`level-item ${level.language} ${isCompleted ? "completed" : ""}`}
                >
                  <Link
                    to={`/level/${encodeURIComponent(chapter.chapterURL)}/${encodeURIComponent(level.levelURL)}`}
                    className="level-link"
                  >
                    <img src={getIcon(level.language)} alt={level.language} className="level-icon" />
                    <span className="level-name">{level.levelName}</span>
                    <span className="level-language">{level.language.toUpperCase()}</span>
                    {isCompleted && <span className="level-status">✔</span>}
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
