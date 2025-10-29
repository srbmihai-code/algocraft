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

db.serialize(() => {
  db.run(createUsersTable, (err) => {
    if (err) console.error("Eroare la crearea tabelului users:", err.message);
    else console.log("Tabela users este gata");
  });

  db.run(createLevelsTable, (err) => {
    if (err) console.error("Eroare la crearea tabelului completed_levels:", err.message);
    else console.log("Tabela completed_levels este gata");
  });
});

module.exports = db;
