const sqlite3 = require('sqlite3').verbose();

// Open a database handle
let db = new sqlite3.Database('./mydb.sqlite3', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

// Create a new table (if it doesn't already exist)
db.run('CREATE TABLE IF NOT EXISTS spaces(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, content TEXT)', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Table created or already exists.');
});





module.exports = db;

// const colors = [
//   "Red",
//   "Blue",
//   "Green",
//   "Yellow",
//   "Orange",
//   "Purple",
//   "Pink",
//   "Teal",
//   "Maroon",
//   "Cyan",
// ];
// const animals = [
//   "Lion",
//   "Tiger",
//   "Elephant",
//   "Giraffe",
//   "Zebra",
//   "Rhino",
//   "Panda",
//   "Koala",
//   "Wolf",
//   "Bear",
// ];
// const foods = [
//   "Pizza",
//   "Pasta",
//   "Sushi",
//   "Burger",
//   "Salad",
//   "Tacos",
//   "Steak",
//   "Curry",
//   "Ramen",
//   "Falafel",
// ];