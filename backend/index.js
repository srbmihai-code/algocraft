const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./db");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3001;
console.log(process.env.ADMIN_PASSWORD)
app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
  if (username === "admin") return res.status(400).json({ success: false, message: "Nu se poate crea contul 'admin'" });
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
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Nume de utilizator și parolă sunt obligatorii."
    });
  }

  // Admin login
  if (username === "admin") {
    console.log(password, process.env.ADMIN_PASSWORD)
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({
        success: false,
        message: "Nume de utilizator sau parolă incorecte."
      });
    }

    req.session.admin = true;
    req.session.adminName = "admin";
    console.log("Admin logged in");
    return res.json({
      success: true,
      role: "admin",
      message: "Autentificare admin reușită.",
      username: "admin"
    });
  }

  // Regular user
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Eroare la baza de date."
        });
      }

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Nume de utilizator sau parolă incorecte."
        });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Nume de utilizator sau parolă incorecte."
        });
      }

      req.session.userId = user.id;
      req.session.admin = false;

      console.log(`User logged in: ${username} (ID: ${user.id})`);
      res.json({
        success: true,
        role: "user",
        message: "Autentificare reușită."
      });
    }
  );
});


// Check current session (user or admin)
app.get("/api/session", (req, res) => {
  if (req.session.admin) {
    return res.json({
      authenticated: true,
      role: "admin"
    });
  }

  if (req.session.userId) {
    return res.json({
      authenticated: true,
      role: "user",
      userId: req.session.userId
    });
  }

  res.json({ authenticated: false });
});


app.get("/api/me", (req, res) => {
  console.log("ME SESSION:", req.session);

  if (req.session.admin) {
    return res.json({
      success: true,
      username: req.session.adminName,
      isAdmin: true,
    });
  }

  if (!req.session.userId) {
    return res.status(401).json({ success: false });
  }

  db.get(
      "SELECT username FROM users WHERE id = ?",
      [req.session.userId],
      (err, user) => {
        if (err || !user)
          return res.status(500).json({ success: false });

        res.json({
          success: true,
          username: user.username,
          isAdmin: false,
        });
      }
  );
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

// Allows a logged-in user to ask a question for a level
app.get("/api/questions", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ success: false });
    }

    const { chapterName, levelName } = req.query;
    if (!chapterName || !levelName) {
        return res.status(400).json({ success: false, message: "Missing chapterName or levelName" });
    }

    db.all(
        `
    SELECT 
      q.*,
      a.answer,
      a.admin_name,
      a.created_at AS answered_at
    FROM questions q
    LEFT JOIN answers a ON q.id = a.question_id
    WHERE q.user_id = ? AND q.chapter_name = ? AND q.level_name = ?
    ORDER BY q.created_at DESC
    `,
        [req.session.userId, chapterName, levelName],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }
            res.json({ success: true, questions: rows });
        }
    );
});

app.post("/api/questions", (req, res) => {
    if (!req.session.userId)
        return res.status(401).json({ success: false });

    const { chapterName, levelName, question, htmlCode, cssCode, jsCode } = req.body;

    if (!question || !chapterName || !levelName)
        return res.status(400).json({ success: false });

    db.get("SELECT username FROM users WHERE id = ?", [req.session.userId], (err, user) => {
        if (err || !user) return res.status(500).json({ success: false });

        db.run(
            `INSERT INTO questions
       (user_id, username, chapter_name, level_name, question, html_code, css_code, js_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [req.session.userId, user.username, chapterName, levelName, question, htmlCode, cssCode, jsCode],
            () => res.json({ success: true })
        );
    });
});

// Admin fetches all questions with answers
app.get("/api/admin/questions", (req, res) => {
  if (!req.session.admin)
    return res.status(403).json({ success: false });

  db.all(
      `
    SELECT
      q.*,
      a.answer,
      a.created_at AS answered_at,
      a.admin_name
    FROM questions q
    LEFT JOIN answers a ON q.id = a.question_id
    ORDER BY q.created_at DESC
    `,
      (err, rows) => {
        if (err) {
            console.log(err)

            return res.status(500).json({ success: false });
        }

        res.json({ success: true, questions: rows });
      }
  );
});

// Admin answers a question
app.post("/api/admin/answer", (req, res) => {
  if (!req.session.admin)
    return res.status(403).json({ success: false });

  const { questionId, answer } = req.body;
  if (!questionId || !answer)
    return res.status(400).json({ success: false });

  db.run(
      `
    INSERT OR REPLACE INTO answers
    (question_id, admin_name, answer)
    VALUES (?, ?, ?)
    `,
      [questionId, req.session.adminName, answer],
      () => res.json({ success: true })
  );
});

const frontendDir = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDir));

app.get(/^\/(?!api).*$/, (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
