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

// Writes spaces table in database with example data if it doesn't exist
db.serialize(() => {
  // Check if the spaces table exists
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='spaces'",
    (err, row) => {
      if (err) {
        console.error("Error checking for spaces table:", err.message);
        return;
      }
      if (row) {
        //console.log(row);
      } else {
        // Create the spaces table
        db.run(
          `CREATE TABLE spaces (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        space_name TEXT UNIQUE,
        created_by TEXT,
        created_date TEXT
      )`,
          (err) => {
            if (err) {
              console.error("Error creating spaces table:", err.message);
              return;
            }
            console.log("Spaces table is ready.");

            // Prepare the insert statement for spaces
            const stmt = db.prepare(
              `INSERT INTO spaces (space_name, created_by, created_date) VALUES (?, ?, ?)`
            );

            spaces.forEach((space) => {
              stmt.run(
                space.space_name,
                space.created_by,
                space.created_date,
                (err) => {
                  if (err) {
                    console.error(
                      `Error inserting ${space.space_name}:`,
                      err.message
                    );
                  } else {
                    console.log(`Inserted space: ${space.space_name}`);
                  }
                }
              );
            });

            // Finalize the statement to clean up resources
            stmt.finalize((err) => {
              if (err) {
                console.error("Error finalizing statement:", err.message);
              } else {
                console.log("All spaces have been inserted.");
              }
            });
          }
        );
      }
    }
  );
});

module.exports = db;
