import { create } from 'zustand';

const useUserPlans = create((set) => ({
    username: '',
    workout: {"Monday": null, "Tuesday": null, "Wednesday": null, "Thursday": null, "Friday": null, "Saturday": null, "Sunday": null},
    meal: {"Monday": null, "Tuesday": null, "Wednesday": null, "Thursday": null, "Friday": null, "Saturday": null, "Sunday": null},
    invalidDate: null,
    setWorkout: (value) => set({ workout: value }),
    setMeal: (value) => set({ meal: value }),
    setInvalidDate: (value) => set({ invalidDate: value }),
  }))
  
export default useUserPlans;