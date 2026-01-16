import { Link } from "react-router-dom";

interface NavProps {
  prevLevel: { chapterURL: string; levelURL: string } | null;
  nextLevel: { chapterURL: string; levelURL: string } | null;
}

export function LevelNavigation({ prevLevel, nextLevel }: NavProps) {
  return (
    <div className="level-buttons">
      <Link to="/levels" className="btn">Niveluri</Link>

      {prevLevel && (
        <Link to={`/level/${prevLevel.chapterURL}/${prevLevel.levelURL}`} className="btn">
          Nivelul precedent
        </Link>
      )}

      {nextLevel && (
        <Link to={`/level/${nextLevel.chapterURL}/${nextLevel.levelURL}`} className="btn">
          Nivelul următor
        </Link>
      )}
    </div>
  );
}
