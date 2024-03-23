"use client";

import React, { useState } from "react";

export default function Home() {
  const [note, setNote] = useState("");

  // Updated function to fetch word from server
  const fetchRandomWord = async () => {
    try {
      const response = await fetch("http://localhost:8080/spaces");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const word = await response.text();
      setNote(word);
    } catch (error) {
      console.error("Failed to fetch random word:", error);
      setNote("Failed to fetch data. Check console for details.");
    }
  };

  // Function to handle button click
  const handleClick = () => {
    console.log('handleclick');
    fetchRandomWord();
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Welcome to SpaceNotes</h1>
      <p>Find a space of your own</p>
      <button
        onClick={handleClick}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Generate Space
      </button>
      {note && (
        <div style={{ marginTop: "20px" }}>
          <strong>Space:</strong> {note}
        </div>
      )}
    </div>
  );
}

const colors = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Teal",
  "Maroon",
  "Cyan",
];
const animals = [
  "Lion",
  "Tiger",
  "Elephant",
  "Giraffe",
  "Zebra",
  "Rhino",
  "Panda",
  "Koala",
  "Wolf",
  "Bear",
];
const foods = [
  "Pizza",
  "Pasta",
  "Sushi",
  "Burger",
  "Salad",
  "Tacos",
  "Steak",
  "Curry",
  "Ramen",
  "Falafel",
];