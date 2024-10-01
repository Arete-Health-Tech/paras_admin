import create from 'zustand';
import { iNodeStore } from '../types/store/node';

const useNodeStore = create<iNodeStore>((set, get) => ({
  nodeConnector: [],
  setNodeConnector: (nodeConnector) => set({ nodeConnector })
}));

export default useNodeStore;
