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

// Define the categories and generate space objects
const adjectives = ["spicy", "snarky", "shrewd"];
const nouns = ["fox", "monk", "peach"];
const spaces = [];

const username = "admin";
const createdAt = new Date().toISOString();

adjectives.forEach((adjective) => {
  nouns.forEach((noun) => {
    spaces.push({
      space_name: `${adjective} ${noun}`,
      created_by: username,
      created_date: createdAt,
    });
  });
});

db.serialize(() => {
  // Create the spaces table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS spaces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      space_name TEXT UNIQUE,
      created_by TEXT,
      created_date TEXT
    )`,
    (err) => {
      if (err) {
        console.error("Error creating spaces table:", err.message);
      } else {
        console.log("Spaces table is ready.");

        // Prepare the insert statement for spaces
        const stmt = db.prepare(
          `INSERT INTO spaces (space_name, created_by, created_date) VALUES (?, ?, ?)`
        );

        spaces.forEach((space) => {
          stmt.run(space.space_name, space.created_by, space.created_date, (err) => {
            if (err) {
              console.error(`Error inserting ${space.space_name}:`, err.message);
            } else {
              console.log(`Inserted space: ${space.space_name}`);
            }
          });
        });

        stmt.finalize((err) => {
          if (err) {
            console.error("Error finalizing statement:", err.message);
          } else {
            console.log("All spaces have been inserted.");
          }
        });
      }
    }
  );

  // Create the posts table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      space_id INTEGER,
      content TEXT,
      created_by TEXT,
      created_date TEXT,
      FOREIGN KEY (space_id) REFERENCES spaces(id)
    )`,
    (err) => {
      if (err) {
        console.error("Error creating posts table:", err.message);
      } else {
        console.log("Posts table is ready.");
      }
    }
  );
});

module.exports = db;
