import React, { useState } from "react";
import "./AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Nume de utilizator și parolă sunt obligatorii.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      return;
    }

    try {
      if (mode === "login") {
        console.log("Logging in", { username, password });
        alert("Autentificare reușită!");
      } else {
        console.log("Signing up", { username, password });
        alert("Cont creat cu succes!");
        setMode("login");
        resetForm();
      }
    } catch {
      setError("Ceva nu a mers bine. Încearcă din nou.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{mode === "login" ? "Autentificare" : "Creare cont"}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Nume de utilizator"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parolă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "signup" && (
          <input
            type="password"
            placeholder="Confirmă parola"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit">{mode === "login" ? "Autentificare" : "Creează cont"}</button>
      </form>
      <p className="toggle-text">
        {mode === "login" ? (
          <>
            Nu ai un cont?{" "}
            <button onClick={() => { setMode("signup"); resetForm(); }}>
              Creează cont
            </button>
          </>
        ) : (
          <>
            Ai deja un cont?{" "}
            <button onClick={() => { setMode("login"); resetForm(); }}>
              Autentificare
            </button>
          </>
        )}
      </p>
    </div>
  );
}
