import { Link } from "react-router-dom";

interface NavProps {
  chapterName?: string;
  prevLevel: string | null;
  nextLevel: string | null;
}

export function LevelNavigation({ chapterName, prevLevel, nextLevel }: NavProps) {
  return (
    <div className="level-buttons">
      <Link to="/levels" className="btn">Niveluri</Link>

      {prevLevel && (
        <Link to={`/level/${chapterName}/${prevLevel}`} className="btn">
          Nivelul precedent
        </Link>
      )}

      {nextLevel && (
        <Link to={`/level/${chapterName}/${nextLevel}`} className="btn">
          Nivelul următor
        </Link>
      )}
    </div>
  );
}
