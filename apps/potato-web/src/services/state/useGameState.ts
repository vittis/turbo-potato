import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameState {
  gameInstance: Phaser.Game | null;
  isGameHidden: boolean;
  isGamePaused: boolean;
  selectedEntity: any;
  setSelectedEntity: (entity: any) => void;
  setIsGamePaused: (isGameRunning: boolean) => void;
  setGameInstance: (gameInstance: Phaser.Game | null) => void;
  hideGame: () => void;
  showGame: () => void;
}

const useGameState = create<GameState>()(
  subscribeWithSelector((set) => ({
    selectedEntity: null,
    isGameHidden: false,
    isGamePaused: true,
    setIsGamePaused: (isGamePaused: boolean) => set({ isGamePaused }),
    setSelectedEntity: (entity: any) => set({ selectedEntity: entity }),
    gameInstance: null,
    setGameInstance: (gameInstance: Phaser.Game | null) => set({ gameInstance }),
    hideGame: () =>
      set(({ gameInstance, isGameHidden }) => {
        if (gameInstance) {
          // state.gameInstance.destroy(true); // todo: fix battleunitsprite to make this work
          gameInstance.canvas.classList.add("hidden");
          return { isGameHidden: true };
        }

        return { isGameHidden };
      }),
    showGame: () =>
      set(({ gameInstance, isGameHidden }) => {
        if (gameInstance) {
          gameInstance.canvas.classList.remove("hidden");
          return { isGameHidden: false };
        }

        return { isGameHidden };
      }),
  }))
);

export { useGameState };
