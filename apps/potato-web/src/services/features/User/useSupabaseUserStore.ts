import { create } from "zustand";

interface SupabaseUserState {
  user: any;
  setUser: (user: any) => void;
  removeUser: () => void;
}

const useSupabaseUserStore = create<SupabaseUserState>()((set) => ({
  user: null,
  setUser: (user: any) => set({ user }),
  removeUser: () => set({ user: null }),
}));

export { useSupabaseUserStore };
