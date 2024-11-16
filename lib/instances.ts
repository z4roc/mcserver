import { Container } from "@/types/docker";
import { create } from "zustand";

interface InstancesState {
  instances: Container[];
  updateInstance: (instance: Container) => void;
  setInstances: (instances: Container[]) => void;
  removeInstance: (instance: Container) => void;
}

export const useInstancesStore = create<InstancesState>()((set) => ({
  instances: [],
  setInstances: (instances) => set({ instances }),
  updateInstance: (instance) => set({ instances: [instance] }),
  removeInstance: (instance) =>
    set((state) => ({
      instances: state.instances.filter((i) => i.Id !== instance.Id),
    })),
}));
