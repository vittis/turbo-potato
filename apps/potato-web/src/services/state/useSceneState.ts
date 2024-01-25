import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface SceneState {
  currentScene: string;
  setCurrentScene: (key: string) => void;
}

const useSceneState = create<SceneState>()(
  subscribeWithSelector((set) => ({
    currentScene: "",
    setCurrentScene: (key: string) => set({ currentScene: key }),
  }))
);

export { useSceneState };
