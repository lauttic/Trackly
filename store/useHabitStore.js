import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'habits';

const useHabitStore = create((set, get) => ({
  habits: [],
  loading: false,

  loadHabits: async () => {
    set({ loading: true });
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const habits = data ? JSON.parse(data) : [];
    set({ habits, loading: false });
  },

  addHabit: async (habit) => {
    const { habits } = get();
    const newHabit = { ...habit, id: Date.now().toString(), done: false };
    const updated = [...habits, newHabit];
    set({ habits: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newHabit;
  },

  updateHabit: async (id, updates) => {
    const { habits } = get();
    const updated = habits.map(h => h.id === id ? { ...h, ...updates } : h);
    set({ habits: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteHabit: async (id) => {
    const { habits } = get();
    const updated = habits.filter(h => h.id !== id);
    set({ habits: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  toggleHabit: async (id) => {
    const { habits } = get();
    const updated = habits.map(h =>
      h.id === id ? { ...h, done: !h.done } : h
    );
    set({ habits: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
}));

export default useHabitStore;
