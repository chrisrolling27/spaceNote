const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Initialize the database connection
const dbPath = path.resolve(__dirname, "database.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Define the categories and generate space names
const adjectives = ["spicy", "snarky", "shrewd"];
const colors = ["red", "green", "blue"];
const nouns = ["fox", "monk", "peach"];
const spacenames = [];
adjectives.forEach(adjective => {
  colors.forEach(color => {
    nouns.forEach(noun => {
      spacenames.push(`${adjective} ${color} ${noun}`);
    });
  });
});

// Serialize database operations
db.serialize(() => {
  // Create the spaces table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS spaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    space_name TEXT UNIQUE,
    username TEXT,
    created_at TEXT
  )`, (err) => {
    if (err) {
      console.error("Error creating spaces table:", err.message);
    } else {
      console.log("Spaces table is ready.");
    }
  });

  // Prepare the insert statement for spaces
  const stmt = db.prepare(`INSERT INTO spaces (space_name, username, created_at) VALUES (?, ?, ?)`);
  const username = 'admin';
  const createdAt = new Date().toISOString();

  spacenames.forEach(space => {
    stmt.run(space, username, createdAt, (err) => {
      if (err) {
        console.error(`Error inserting ${space}:`, err.message);
      } else {
        console.log(`Inserted space: ${space}`);
      }
    });
  });

  // Finalize the statement
  stmt.finalize((err) => {
    if (err) {
      console.error("Error finalizing statement:", err.message);
    } else {
      console.log("All spaces have been inserted.");
    }
  });
});

module.exports = db;
