import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';
function QuestionnairePage({ setRecipes, setUserName }) {
    const [name, setName] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');
    const [timeRestrictions, setTimeRestrictions] = useState('');
    const [error, setError] = useState(null);
  
    const navigate = useNavigate();
    const SHEET_ID = '1Z0oCtcbhaZR_BwIgbZIuCfP_oC57StjMHOEnzX9le4k';
    const API_KEY = process.env.REACT_APP_API_KEY;


    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`
        );
        const rows = response.data.values;
  
        const maxTime = timeRestrictions ? parseInt(timeRestrictions, 10) : null;
  
        const filteredRecipes = rows
          .filter(row => {
            const category = row[3];
            const totalTime = row[1];
            const meetsDietary = !dietaryRestrictions || category === dietaryRestrictions;
            const meetsTime = !maxTime || (parseInt(totalTime, 10) <= maxTime);
            return meetsDietary && meetsTime;
          })
          .slice(0, 7);
  
        setRecipes(filteredRecipes); // Update recipes state in App.js
        setUserName(name); // Update the name in App.js
        setError(null); // Clear any errors
        navigate('/recipes'); // Redirect to RecipePage
      } catch (error) {
        console.error('Error fetching data from Google Sheets', error);
        setError('Failed to fetch data. Please try again.');
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
  
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }
  
  export default QuestionnairePage;
  