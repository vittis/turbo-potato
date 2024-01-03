import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface UserState {
  userData: {
    name: string;
    userId: string;
    rooms: string[];
  };
  setUserData: (userData: UserState["userData"]) => void;
}

const useUserStore = create<UserState>()(
  subscribeWithSelector((set) => ({
    userData: {
      name: "",
      userId: "",
      rooms: [],
    },
    setUserData: (userData: UserState["userData"]) => set({ userData }),
  }))
);

export { useUserStore };
