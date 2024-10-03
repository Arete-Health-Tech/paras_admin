import { create } from 'zustand';
import { iConsumerStore } from '../types/store/consumer';

const useConsumerStore = create<iConsumerStore>((set) => ({
  registerUhid: "",
  setRegisterUhid: (registerUhid) => set({registerUhid}),
  searchResults: [],
  setSearchResults: (consumers) => set({ searchResults: consumers }),
  consumerHistory: [],
  setConsumerHistory: (consumerHistory) => set({ consumerHistory })
}));

export default useConsumerStore;
