const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const db = require("./db/database.js");

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.static("public"));
app.use(express.json());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Serves mainpage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Function to get a random space
async function getRandomSpace() {
  return new Promise((resolve, reject) => {
    db.all("SELECT space_id FROM Spaces", [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      if (rows.length === 0) {
        return reject(new Error("No spaces found"));
      }
      const randomIndex = Math.floor(Math.random() * rows.length);
      const randomSpaceId = rows[randomIndex].space_id;

      db.get(
        "SELECT * FROM Spaces WHERE space_id = ?",
        [randomSpaceId],
        (err, row) => {
          if (err) {
            return reject(err);
          }
          resolve(row);
        }
      );
    });
  });
}

// Fetch and display a random space
app.get("/randomspace", async (req, res) => {
  try {
    const space = await getRandomSpace();
    res.json({
      message: "success",
      data: {
        space_id: space.space_id,
        space_name: space.space_name,
        created_at: space.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
