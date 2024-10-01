import { create } from 'zustand';
import { iConsumerStore } from '../types/store/consumer';

const useConsumerStore = create<iConsumerStore>((set) => ({
  searchResults: [],
  setSearchResults: (consumers) => set({ searchResults: consumers }),
  consumerHistory: [],
  setConsumerHistory: (consumerHistory) => set({ consumerHistory })
}));

export default useConsumerStore;
