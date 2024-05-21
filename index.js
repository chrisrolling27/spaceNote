const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const db = require("./db/database.js");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 3000;
const apiKey = process.env.chriskey;

app.use(express.static("public"));
app.use(express.json());

app.engine(
  "hbs",
  engine({ extname: ".hbs", layoutsDir: path.join(__dirname, "views") })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));


// Serves main page
app.get("/", (req, res) => {
  res.render();
});

// Get random space 
app.get("/randomspace", async (req, res) => {
  
  async function getRandomSpace() {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT space_id, space_name, created_at FROM Spaces",
        [],
        (err, rows) => {
          if (err) {
            return reject(err);
          }
          if (rows.length === 0) {
            return reject(new Error("No spaces found"));
          }
          const randomIndex = Math.floor(Math.random() * rows.length);
          const randomSpace = rows[randomIndex];
          resolve(randomSpace);
        }
      );
    });
  }
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

// Go to a space
app.get("/:space_name", (req, res) => {
  const spaceName = req.params.space_name;
  db.get(
    "SELECT * FROM Spaces WHERE space_name = ?",
    [spaceName],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "Space not found" });
      }
      res.render("main", {
        space_name: row.space_name,
        space_id: row.space_id,
        created_at: row.created_at,
      });
    }
  );
});

// Get a space's posts
app.get("/:space_name/posts", (req, res) => {
  const spaceName = req.params.space_name;
  db.get(
    "SELECT space_id FROM Spaces WHERE space_name = ?",
    [spaceName],
    (err, space) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!space) {
        return res.status(404).json({ error: "Space not found" });
      }

      const spaceId = space.space_id;
      db.all(
        "SELECT * FROM Posts WHERE space_id = ?",
        [spaceId],
        (err, posts) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ posts });
        }
      );
    }
  );
});

//Posts to space 
app.post("/:space_name/posts", async (req, res) => {
  const spaceName = req.params.space_name;
  const { longText, userId, imageUrl } = req.body;

  try {
    const space = await new Promise((resolve, reject) => {
      db.get(
        "SELECT space_id FROM Spaces WHERE space_name = ?",
        [spaceName],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    const spaceId = space.space_id;
  
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO Posts (space_id, user_id, content, image_url) VALUES (?, ?, ?, ?)",
        [spaceId, userId, longText, imageUrl],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    res.json({ message: "Post created successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});











app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});