const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./db");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(cors({
    origin: "https://algocraft-rlny.onrender.com",
    credentials: true,
  }));
} else {
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
}

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: "Nume de utilizator și parolă sunt obligatorii." });

  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username, hash],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") return res.status(400).json({ success: false, message: "Numele de utilizator există deja." });
          return res.status(500).json({ success: false, message: "Eroare la baza de date." });
        }

        req.session.userId = this.lastID;
        console.log(`User created: ${username} (ID: ${this.lastID})`);
        res.json({ success: true, message: "Cont creat cu succes." });
      }
    );
  } catch {
    res.status(500).json({ success: false, message: "Eroare la crearea contului." });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: "Nume de utilizator și parolă sunt obligatorii." });

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ success: false, message: "Eroare la baza de date." });
    if (!user) return res.status(400).json({ success: false, message: "Nume de utilizator sau parolă incorecte." });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ success: false, message: "Nume de utilizator sau parolă incorecte." });

    req.session.userId = user.id;
    console.log(`User logged in: ${username} (ID: ${user.id})`);
    res.json({ success: true, message: "Autentificare reușită." });
  });
});

app.get("/api/session", (req, res) => {
  if (req.session.userId) res.json({ authenticated: true, userId: req.session.userId });
  else res.json({ authenticated: false });
});

app.get("/api/me", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ success: false, message: "Neautentificat." });

  db.get("SELECT username FROM users WHERE id = ?", [req.session.userId], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: "Eroare la baza de date." });
    if (!user) return res.status(404).json({ success: false, message: "Utilizator inexistent." });
    res.json({ success: true, username: user.username });
  });
});

app.get("/api/completed-levels", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ success: false, message: "Neautorizat." });

  db.all("SELECT * FROM completed_levels WHERE user_id = ?", [req.session.userId], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Eroare la baza de date." });
    res.json({ success: true, levels: rows });
  });
});

app.post("/api/complete-level", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ success: false, message: "Neautentificat." });

  const { level_name } = req.body;
  if (!level_name) return res.status(400).json({ success: false, message: "Nivelul este obligatoriu." });

  db.run("INSERT INTO completed_levels (user_id, level_name) VALUES (?, ?)", [req.session.userId, level_name], function (err) {
    if (err) return res.status(500).json({ success: false, message: "Eroare la salvarea nivelului completat." });
    console.log(`Level completed: ${level_name} by user ID: ${req.session.userId}`);
    res.json({ success: true, message: "Nivelul a fost marcat ca finalizat." });
  });
});

app.post("/api/logout", (req, res) => {
  const userId = req.session.userId;
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    console.log(`User logged out: ID ${userId}`);
    res.json({ success: true, message: "Deconectare reușită." });
  });
});

const frontendDir = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDir));

app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
