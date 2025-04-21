// pages/myplans2.js
"use client"
import React, { useState } from 'react';
import styles from './NutritionPlans.module.css';

const mealData = {
  Monday: [
    {
      category: 'Breakfast',
      meal: {
        name: 'Oatmeal',
        ingredients: ['Oats', 'Banana', 'Almond Milk'],
        recipe: 'Mix oats and almond milk, heat for 3 minutes, top with banana.',
        prepTime: '5 min'
      }
    },
    {
      category: 'Lunch',
      meal: {
        name: 'Tomato Soup',
        ingredients: ['Tomatoes', 'Garlic', 'Basil', 'Onion'],
        recipe: 'Boil ingredients and blend until smooth.',
        prepTime: '25 min'
      }
    }
  ],
  Tuesday: [
    {
      category: 'Dinner',
      meal: {
        name: 'Grilled Salmon',
        ingredients: ['Salmon', 'Lemon', 'Herbs'],
        recipe: 'Grill salmon with lemon and herbs until cooked.',
        prepTime: '20 min'
      }
    }
  ]
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function NutritionPlans() {
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [groceryList, setGroceryList] = useState([]);

  const handleSelect = (day, mealBlock) => {
    setSelectedMeal({ day, ...mealBlock });
  };

  const handleGenerateGroceryList = () => {
    const ingredients = [];
    Object.values(mealData).forEach(day => {
      day.forEach(meal => {
        ingredients.push(...(meal.meal.ingredients || []));
      });
    });
    const uniqueIngredients = [...new Set(ingredients)];
    setGroceryList(uniqueIngredients);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.header}>Weekly Meal Plan</h1>

        <div className={styles.calendarGrid}>
          {daysOfWeek.map((day) => (
            <div key={day} className={styles.dayCard}>
              <h3>{day}</h3>
              {(mealData[day] || []).map((meal, idx) => (
                <button
                  key={idx}
                  className={styles.mealButton}
                  onClick={() => handleSelect(day, meal)}
                >
                  {meal.category} – {meal.meal.name}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.groceryButtonWrapper}>
          <button onClick={handleGenerateGroceryList} className={styles.groceryButton}>
            Generate Weekly Grocery List
          </button>
        </div>

        {selectedMeal && (
          <div className={styles.mealDisplay}>
            <h2>{selectedMeal.category} – {selectedMeal.meal.name}</h2>
            <p><strong>Preparation Time:</strong> {selectedMeal.meal.prepTime}</p>
            <p><strong>Ingredients:</strong></p>
            <ul>
              {selectedMeal.meal.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p><strong>Recipe:</strong></p>
            <p>{selectedMeal.meal.recipe}</p>
          </div>
        )}

        {groceryList.length > 0 && (
          <div className={styles.groceryListDisplay}>
            <h2>Grocery List</h2>
            <ul>
              {groceryList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
