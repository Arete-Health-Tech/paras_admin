import { create } from 'zustand';
import { iEventStore } from '../types/store/event';

const useEventStore = create<iEventStore>((set, get) => ({
  loading: false,
  setLoading: (loading) => {
    set({ loading });
  },
  snacks: [],
  setSnacks: (message, type) =>
    set((prev) => ({
      snacks: [...prev.snacks, { message, type, id: prev.snacks.length }]
    })),
  removeSnack: (id) => {
    const snacks = get().snacks;
    const index = snacks.findIndex((item) => item.id === id);
    snacks.splice(index, 1);
    set({ snacks });
  }
}));

export default useEventStore;
