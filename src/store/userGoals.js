import { create } from 'zustand';

const useUserGoals = create((set) => ({
    workoutsPerWeek: 2,
    timePerWorkoutInHours: "1",
    allocatedCaloriesPerDay: 2000,
    strengthExerciseGoals: {}, // AI generated
    cardioExerciseGoals: {}, // AI generated
  }))
  
export default useUserGoals;