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

app.engine(
  "hbs",
  engine({ extname: ".hbs", layoutsDir: path.join(__dirname, "views") })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Serves main page
app.get("/", (req, res) => {
  res.render("main", {
    title: "Home",
    content:
      "<h1>Welcome to the Home Page</h1><p>This is the main content of the home page.</p>",
  });
});

// Function to get a random space
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

// Fetch and display a random space
app.get("/randomspace", async (req, res) => {
  try {
    const space = await getRandomSpace();
    const sanitizedSpaceName = space.space_name.replace(/\s+/g, "-"); // Replace spaces with hyphens
    res.json({
      message: "success",
      data: {
        space_id: space.space_id,
        space_name: sanitizedSpaceName,
        created_at: space.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to go to the requested random space directly
app.get("/:space_name", (req, res) => {
  const spaceName = req.params.space_name.replace(/-/g, " "); // Replace hyphens with spaces
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
        created_at: row.created_at
      });
    }
  );
});

// Route to fetch threads and posts
app.get("/:space_name/threads", (req, res) => {
  const spaceName = req.params.space_name.replace(/-/g, " ");
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
        "SELECT * FROM Threads WHERE space_id = ?",
        [spaceId],
        (err, threads) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const threadIds = threads.map((thread) => thread.thread_id);
          if (threadIds.length === 0) {
            return res.json({ threads: [], posts: [] });
          }

          db.all(
            "SELECT * FROM Posts WHERE thread_id IN (" +
              threadIds.map(() => "?").join(",") +
              ")",
            threadIds,
            (err, posts) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json({ threads, posts });
            }
          );
        }
      );
    }
  );
});
