import React, { useState } from "react";
import { login, signup } from "../utils/api";
import "./AuthPage.css";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

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
        const res = await login(username, password);
        setMessage(res.message);
      } else {
        const res = await signup(username, password);
        setMessage(res.message);
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
        {message && <p className="message">{message}</p>}
        <button type="submit">{mode === "login" ? "Autentificare" : "Creează cont"}</button>
      </form>
      <p className="toggle-text">
        {mode === "login" ? (
          <>
            Nu ai un cont?{" "}
            <button onClick={() => { setMode("signup"); resetForm(); }}>Creează cont</button>
          </>
        ) : (
          <>
            Ai deja un cont?{" "}
            <button onClick={() => { setMode("login"); resetForm(); }}>Autentificare</button>
          </>
        )}
      </p>
    </div>
  );
}
