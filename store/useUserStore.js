import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserStore = create((set) => ({
  user: null,

  login: async (username, password) => {
    const stored = await AsyncStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;
    if (user && user.username === username && user.password === password) {
      set({ user });
      return true;
    }
    return false;
  },

  register: async (username, password) => {
    await AsyncStorage.setItem('user', JSON.stringify({ username, password }));
  },

  logout: () => {
    set({ user: null });
  },
}));

export default useUserStore;
