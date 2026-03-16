import { create } from "zustand";
import { signIn, signOut } from "next-auth/react";

interface AuthState {
  loading: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  loading: false,
  error: null,

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res?.error) throw new Error(res.error);
    } catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : "Ошибка входа" });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    await signOut();
  },
}));
