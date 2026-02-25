import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "recruiter" | "officer" | "admin";
  photoURL?: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (token, user) => set({ token, user }),

      logout: () => set({ token: null, user: null }),

      updateUser: (partial) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...partial } });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export { useAuthStore };
export default useAuthStore;
