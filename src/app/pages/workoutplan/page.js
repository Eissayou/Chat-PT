// pages/workouts.js
"use client"
import React, { useState } from 'react';
import styles from './styles/Workouts.module.css';

const weeklyWorkoutJSON = {
  Monday: [
    {
      category: 'Warm-Up - Day 1',
      exercises: {
        'Jumping Jacks': { duration: '2 min' },
        'Arm Circles': { duration: '1 min' }
      }
    },
    {
      category: 'Cardio - Day 2',
      exercises: {
        Running: { distance: '5km', pace: '5:30/km' },
        Cycling: { distance: '15km', duration: '30 min' }
      }
    }
  ],
  Tuesday: [
    {
      category: 'Strength - Upper Body',
      exercises: {
        'Bench Press': { sets: 3, reps: 10, rest: '60s' },
        'Push-ups': { sets: 4, reps: 12, rest: '45s' }
      }
    }
  ],
  Wednesday: [
    {
      category: 'Cooldown - Mobility',
      exercises: {
        Stretching: { time: '5 min' },
        FoamRolling: { duration: '3 min' }
      }
    }
  ]
};

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklyWorkout() {
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const handleSelect = (day, workout) => {
    setSelectedWorkout({ day, ...workout });
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.header}>Weekly Workout Plan</h1>

        {/* Calendar Grid */}
        <div className={styles.calendarGrid}>
          {daysOfWeek.map((day) => (
            <div key={day} className={styles.dayCard}>
              <h3>{day}</h3>
              {(weeklyWorkoutJSON[day] || []).map((workout, index) => (
                <button
                  key={index}
                  className={styles.workoutButton}
                  onClick={() => handleSelect(day, workout)}
                >
                  {workout.category}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Selected Workout View */}
        {selectedWorkout && (
          <div className={styles.workoutDisplay}>
            <h2>{selectedWorkout.category} - {selectedWorkout.day}</h2>
            {Object.entries(selectedWorkout.exercises).map(([exercise, details]) => (
              <div key={exercise} className={styles.exerciseCard}>
                <div className={styles.exerciseName}>{exercise}</div>
                <div className={styles.exerciseDetails}>
                  <ul>
                    {Object.entries(details).map(([k, v]) => (
                      <li key={k}><strong>{capitalize(k)}:</strong> {v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
