import { create } from "zustand";

interface UserState {
  isLoggedIn: boolean;
  userData: {
    name: string;
    userId: string;
  };
  setUserData: (userData: UserState["userData"]) => void;
  removeUserData: () => void;
}

const useUserStore = create<UserState>()((set) => ({
  isLoggedIn: false,
  userData: {
    name: "",
    userId: "",
  },
  setUserData: (userData: UserState["userData"]) => set({ userData, isLoggedIn: true }),
  removeUserData: () => set({ userData: { name: "", userId: "" }, isLoggedIn: false }),
}));

export { useUserStore };
