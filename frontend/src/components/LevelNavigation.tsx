import { Link } from "react-router-dom";

interface NavProps {
  prevLevel: { chapterURL: string; levelURL: string } | null;
  nextLevel: { chapterURL: string; levelURL: string } | null;
  currentURL: string;
}

export function LevelNavigation({ prevLevel, nextLevel, currentURL }: NavProps) {
  return (
    <div className="level-buttons">
      <Link to={`/levels?chapter=${currentURL}`} className="btn">Niveluri</Link>

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
