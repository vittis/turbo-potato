import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameState {
  isGamePaused: boolean;
  selectedEntity: any;
  setSelectedEntity: (entity: any) => void;
  setIsGamePaused: (isGameRunning: boolean) => void;
}

const useGameStore = create<GameState>()(
  subscribeWithSelector((set) => ({
    selectedEntity: null,
    isGamePaused: true,
    setIsGamePaused: (isGamePaused: boolean) => set({ isGamePaused }),
    setSelectedEntity: (entity: any) => set({ selectedEntity: entity }),
  }))
);

export { useGameStore };
