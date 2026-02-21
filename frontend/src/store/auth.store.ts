import { create } from "zustand";

interface User {
  id: string;
  role: "student" | "recruiter" | "officer" | "admin";
  tenantId: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  setAuth: (token, user) => set({ token, user }),

  logout: () => set({ token: null, user: null }),
}));

export { useAuthStore };
export default useAuthStore;
