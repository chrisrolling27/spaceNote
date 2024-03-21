"use client";

import React, { useState } from 'react';

export default function Home() {

  const [note, setNote] = useState('');


  const generateRandomWord = () => {

  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Teal', 'Maroon', 'Cyan'];
  const animals = ['Lion', 'Tiger', 'Elephant', 'Giraffe', 'Zebra', 'Rhino', 'Panda', 'Koala', 'Wolf', 'Bear'];
  const foods = ['Pizza', 'Pasta', 'Sushi', 'Burger', 'Salad', 'Tacos', 'Steak', 'Curry', 'Ramen', 'Falafel'];

  const selectRandom = (array) => array[Math.floor(Math.random() * array.length)];

  const randomAnimal = selectRandom(animals);
  const randomColor = selectRandom(colors);
  const randomFood = selectRandom(foods);

  return `${randomColor}${randomAnimal}${randomFood}`;
};


  // Function to handle button click
  const handleClick = () => {
    const randomString = generateRandomWord();
    setNote(randomString);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to SpaceNotes</h1>
      <p>Find a space of your own</p>
      <button onClick={handleClick} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Generate Space
      </button>
      {note && <div style={{ marginTop: '20px' }}><strong>Space:</strong> {note}</div>}
    </div>
  );
}
