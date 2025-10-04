import { create } from "zustand";

type AuthUser = {
  name: string;
  id: number;
  age: number;
};

type AuthStore = {
  authUser: AuthUser;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  authUser: { name: "john", id: 123, age: 23 },
  isLoading: false,
  isLoggedIn: false,

  login: () => {
    console.log("We just logger in");
    set({ isLoggedIn: true, isLoading: true });
  },
}));
