const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "users.db");
const db = new sqlite3.Database(dbPath);

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`;

const createLevelsTable = `
CREATE TABLE IF NOT EXISTS completed_levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  level_name TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
`;

const createQuestionsTable = `
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  chapter_name TEXT NOT NULL,
  level_name TEXT NOT NULL,
  question TEXT NOT NULL,
  html_code TEXT,
  css_code TEXT,
  js_code TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
`;


const createAnswersTable = `
CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER UNIQUE NOT NULL,
  admin_name TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id)
)
`;

db.serialize(() => {
  db.run(createUsersTable, (err) => {
    if (err) console.error("Error creating users table:", err.message);
    else console.log("Users table ready");
  });

  db.run(createLevelsTable, (err) => {
    if (err) console.error("Error creating completed_levels table:", err.message);
    else console.log("Completed_levels table ready");
  });

  db.run(createQuestionsTable, (err) => {
    if (err) console.error("Error creating questions table:", err.message);
    else console.log("Questions table ready");
  });

  db.run(createAnswersTable, (err) => {
    if (err) console.error("Error creating answers table:", err.message);
    else console.log("Answers table ready");
  });
});

module.exports = db;
