import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface SetupState {
  isTeamValid: boolean;
  onClickReady: () => void;
}

const useSetupState = create<SetupState>()(
  subscribeWithSelector((set) => ({
    isTeamValid: false,
    onClickReady: () => set({ isTeamValid: true }),
  }))
);

export { useSetupState };
