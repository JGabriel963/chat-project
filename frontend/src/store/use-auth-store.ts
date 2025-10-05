import { create } from "zustand";
import { api } from "../lib/axios";
import type { SignUpSchema } from "../http/schemas/signup";
import toast from "react-hot-toast";
import type { LoginSchema } from "../http/schemas/login";
import type { UploadProfileSchema } from "../http/schemas/upload-profile";

type AuthStore = {
  authUser: UserCheckResponse | null;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: SignUpSchema) => Promise<void>;
  login: (data: LoginSchema) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UploadProfileSchema) => Promise<void>;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  authUser: null,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await api.get<UserCheckResponse>("/auth/check");
      set({ authUser: res.data, isCheckingAuth: false });
    } catch (error) {
      console.log("Error", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data: SignUpSchema) => {
    try {
      const res = await api.post<UserCheckResponse>("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Conta criada com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao criar uma conta!");
    }
  },
  login: async (data: LoginSchema) => {
    try {
      const res = await api.post<UserCheckResponse>("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao entrar na conta!");
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      toast.success("Deslogado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deslogar!");
    }
  },
  updateProfile: async (data: UploadProfileSchema) => {
    try {
      const res = await api.put<UploadProfileResponse>(
        "/auth/update-profile",
        data
      );
      set({ authUser: { id: res.data.user._id, ...res.data.user } });
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar o perfil!");
    }
  },
}));
