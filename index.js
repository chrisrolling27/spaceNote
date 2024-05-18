const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { engine } = require("express-handlebars");
const db = require("./database");

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

//serves mainpage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/clicked", (req, res) => {
  const { spaceName } = req.body;

  console.log("Space clicked:", spaceName);
  res.json({ success: true, message: `Space ${spaceName} clicked` });
});

app.get("/space/:spaceId", (req, res) => {
  const { spaceId } = req.params;

  // Example data
  const data = {
    spaceId: spaceId,
    content: "This is your old saved content",
  };

  // Render a Handlebars template (assuming you have a 'space.handlebars' template)
  res.render("space", data);
});
