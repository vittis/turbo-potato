import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameState {
  isGameRunning: boolean;
  selectedEntity: any;
  setSelectedEntity: (entity: any) => void;
  setIsGameRunning: (isGameRunning: boolean) => void;
}

const useGameStore = create<GameState>()(
  subscribeWithSelector((set) => ({
    selectedEntity: null,
    isGameRunning: false,
    setIsGameRunning: (isGameRunning: boolean) => set({ isGameRunning }),
    setSelectedEntity: (entity: any) => set({ selectedEntity: entity }),
  }))
);

export { useGameStore };
