const fs = require('fs');
const path = require('path');

// Path to the database file
const dbPath = path.resolve(__dirname, 'database.db');

// Function to delete the database file
fs.unlink(dbPath, (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.log("Database file does not exist.");
    } else {
      console.error("Error deleting database:", err.message);
    }
  } else {
    console.log("Database deleted successfully.");
  }
});
