import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameState {
  gameInstance: Phaser.Game | null;
  isGamePaused: boolean;
  selectedEntity: any;
  setSelectedEntity: (entity: any) => void;
  setIsGamePaused: (isGameRunning: boolean) => void;
  setGameInstance: (gameInstance: Phaser.Game) => void;
}

const useGameState = create<GameState>()(
  subscribeWithSelector((set) => ({
    selectedEntity: null,
    isGamePaused: true,
    setIsGamePaused: (isGamePaused: boolean) => set({ isGamePaused }),
    setSelectedEntity: (entity: any) => set({ selectedEntity: entity }),
    gameInstance: null,
    setGameInstance: (gameInstance: Phaser.Game) => set({ gameInstance }),
  }))
);

export { useGameState };
