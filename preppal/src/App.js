// src/App.js
// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State to store user inputs and meal data
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [timeRestrictions, setTimeRestrictions] = useState('');
  const [recipes, setRecipes] = useState([]);

  // Google Sheets API key and sheet details
  const SHEET_ID = 'YOUR_SHEET_ID'; // Replace with your Google Sheets ID
  const API_KEY = 'YOUR_API_KEY'; // Replace with your API Key

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`
      );
      const rows = response.data.values;

      // Filter recipes based on dietary restrictions
      const filteredRecipes = rows.filter(row => {
        const category = row[3]; // Assuming category is in the 4th column
        if (dietaryRestrictions && category !== dietaryRestrictions) {
          return false;
        }
        return true;
      });

      // Select 7 random recipes
      const selectedRecipes = filteredRecipes.slice(0, 7);
      setRecipes(selectedRecipes);
    } catch (error) {
      console.error('Error fetching data from Google Sheets', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div className="app-container">
      <header className="hero">
        <h1>Welcome to PrepPal</h1>
        <p>Your Personalized Meal Prep Assistant!</p>
      </header>

      <section className="form-section">
        <h2>Tell Us About Yourself</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">What’s your name?</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="budget">What’s your budget?</label>
            <input 
              type="text" 
              id="budget" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)} 
              placeholder="Optional" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="dietaryRestrictions">Any dietary restrictions?</label>
            <select 
              id="dietaryRestrictions" 
              value={dietaryRestrictions} 
              onChange={(e) => setDietaryRestrictions(e.target.value)}
            >
              <option value="">No restrictions</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="timeRestrictions">How much time do you have to cook?</label>
            <input 
              type="text" 
              id="timeRestrictions" 
              value={timeRestrictions} 
              onChange={(e) => setTimeRestrictions(e.target.value)} 
              placeholder="Optional" 
            />
          </div>
          <button type="submit" className="submit-button">Generate My Meal Plan</button>
        </form>
      </section>

      <section className="recipe-section">
        <h2>Your Meal Prep Plan</h2>
        {recipes.length > 0 ? (
          <div className="recipes">
            {recipes.map((recipe, index) => (
              <div key={index} className="recipe-card">
                <img src={recipe[8]} alt={recipe[0]} className="recipe-image" /> {/* Assuming image URL is in the 9th column */}
                <h3>{recipe[0]}</h3> {/* Recipe name */}
                <p>Total time: {recipe[1]}</p>
                <p>Servings: {recipe[2]}</p>
                <p>Category: {recipe[3]}</p>
                <p>Nutritional values: {recipe[4]}</p>
                <p>Ingredients: {recipe[5]}</p>
                <p>Steps: {recipe[6]}</p>
                <a href={recipe[7]} target="_blank" rel="noopener noreferrer">Full Recipe</a>
              </div>
            ))}
          </div>
        ) : (
          <p>No recipes available. Please fill out the form and submit.</p>
        )}
      </section>
    </div>
  );
}

export default App;
