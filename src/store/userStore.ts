import create from 'zustand';
import { iUserStore } from '../types/store/user';

const useUserStore = create<iUserStore>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
  }
}));

export default useUserStore;
