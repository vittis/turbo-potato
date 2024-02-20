import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface SetupState {
  isTeamValid: boolean;
  shouldStartGame: boolean;
  onClickReady: () => void;
  onStartGame: () => void;
}

const useSetupState = create<SetupState>()(
  subscribeWithSelector((set) => ({
    shouldStartGame: false,
    isTeamValid: false,
    onClickReady: () => set({ isTeamValid: true }),
    onStartGame: () => set({ shouldStartGame: true }),
  }))
);

export { useSetupState };
