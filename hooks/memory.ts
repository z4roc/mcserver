import { create } from "zustand";

interface ServerMemoryState {
  memory: number;
  setMemory: (memory: number) => void;
}
export const useServerMemory = create<ServerMemoryState>()((set) => ({
  memory: 0,
  setMemory: (memory: number) => set({ memory }),
}));
