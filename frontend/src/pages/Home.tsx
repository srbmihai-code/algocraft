import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import checkSession from "../utils/checkSession";
import "./Home.css";
import logo from "../assets/light-bulb.png";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    checkSession().then((res) => {
      if (res.authenticated) {
        navigate("/levels");
      }
    });
  }, [navigate]);

  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <div className="home-header-spacer" />
          <Link to="/" className="home-logo-link">
            <img src={logo} alt="Logo" className="home-logo" />
            <span className="home-site-name">AlgoCraft</span>
          </Link>
          <div className="home-header-spacer" />
        </header>

        <main className="home-hero">
          <h1>Învață frontend și algoritmi în același loc</h1>
          <p>
Pe AlgoCraft înveți să construiești site-uri cu HTML, CSS și JavaScript, dar și să înțelegi algoritmi și structuri de date, astfel încât aplicațiile tale să fie mai rapide și mai bine organizate.
          </p>
          <div className="home-actions">
            <Link to="/levels" className="home-btn primary">
              Vezi nivelurile
            </Link>
            <Link to="/auth" className="home-btn secondary">
              Autentificare / Creare cont
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
