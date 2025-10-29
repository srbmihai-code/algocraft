import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import { getApiBase } from "../utils/apiBase";

async function login(username: string, password: string) {
  const res = await fetch(`${getApiBase()}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

async function signup(username: string, password: string) {
  console.log(`${getApiBase()}/signup`)
  const res = await fetch(`${getApiBase()}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

async function checkSession() {
  const res = await fetch(`${getApiBase()}/session`, {
    credentials: "include",
  });
  return res.json();
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkSession().then((res) => {
      console.log(res)
      if (res.authenticated) navigate("/levels");
    });
  }, [navigate]);

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
        if (res.success) {
          setMessage(res.message);
          navigate("/levels");
        } else {
          setError(res.message);
        }
      } else {
        const res = await signup(username, password);
        if (res.success) {
          setMessage(res.message);
          setMode("login");
          resetForm();
          navigate("/levels");
        } else {
          setError(res.message);
        }
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
            <button
              onClick={() => {
                setMode("signup");
                resetForm();
              }}
            >
              Creează cont
            </button>
          </>
        ) : (
          <>
            Ai deja un cont?{" "}
            <button
              onClick={() => {
                setMode("login");
                resetForm();
              }}
            >
              Autentificare
            </button>
          </>
        )}
      </p>
    </div>
  );
}
