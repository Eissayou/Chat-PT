import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserData = create(
  persist(
    (set, get) => ({
      // state
      username: '',
      height: '0cm',
      weight: '0lbs',
      age: '0',
      gender: 'n/a',
      bench: '0lbs',
      squat: '0lbs',
      deadlift: '0lbs',
      mileTime: '0s',

      // actions
      setUserName: (value) => set({ username: value }),
      setHeight: (value) => set({ height: value }),
      setWeight: (value) => set({ weight: value }),
      setAge: (value) => set({ age: value }),
      setGender: (value) => set({ gender: value }),
      setBench: (value) => set({ bench: value }),
      setSquat: (value) => set({ squat: value }),
      setDeadlift: (value) => set({ deadlift: value }),
      setMileTime: (value) => set({ mileTime: value }),

      // hydration status
      hasHydrated: false,
      setHasHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "user-data",
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated?.(); // ✅ set hydration flag when rehydrated
      },
    }
  )
);

export default useUserData;