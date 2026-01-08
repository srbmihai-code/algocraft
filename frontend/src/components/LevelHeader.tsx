import { Link } from "react-router-dom";

interface Props {
  username: string | null;
  isCompleted: boolean;
}

export function LevelHeader({ username, isCompleted }: Props) {
  return (
    <div className="level-header">
      {username ? (
        <p>Bine ai venit, {username}!</p>
      ) : (
        <p><Link to="/auth">Loghează-te</Link> pentru a-ți salva progresul</p>
      )}
      {isCompleted && <span className="completed-label">Rezolvat ✔</span>}
    </div>
  );
}
