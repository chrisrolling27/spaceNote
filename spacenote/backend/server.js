const express = require("express");
const next = require("next");
const db = require("./database.js");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/hello", (req, res) => {
    res.send("Hello");
  });

  // app.get("/spaces", (req, res) => {
  //   db.all("SELECT * FROM spaces", [], (err, rows) => {
  //     if (err) {
  //       res.status(400).json({ error: err.message });
  //       return;
  //     }
  //     res.json({
  //       message: "success",
  //       data: rows,
  //     });
  //   });
  // });

  // Handling all other requests with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
