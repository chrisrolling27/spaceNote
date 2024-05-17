const express = require("express");
const app = express();
const { engine } = require('express-handlebars');
const path = require('path');
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
app.use(express.static("public"));
app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


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
  
    // Example data - you might replace this with actual data fetching logic later
    const data = {
      spaceId: spaceId,
      content: "This is your old saved content"
    };
  
    // Render a Handlebars template (assuming you have a 'space.handlebars' template)
    res.render("space", data);
  });