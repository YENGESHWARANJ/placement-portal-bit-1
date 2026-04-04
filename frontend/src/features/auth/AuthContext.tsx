import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../../services/api";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface User {
    _id: string;
    name: string;
    email: string;
    role: "student" | "recruiter" | "officer" | "admin";
    photoURL?: string | null;
    company?: string;
    status?: string;
    emailVerified?: boolean;
    profileCompleted?: boolean;
    provider?: "email" | "google";
    lastLogin?: string;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
    redirectPath: string;
    refreshUser: () => Promise<void>;
}

// ─── Role redirect helper ────────────────────────────────────────────────────
export const getRoleRedirect = (role: string): string => {
    switch (role) {
        case "admin":
        case "officer":
            return "/admin/dashboard";
        case "recruiter":
            return "/jobs/my";
        default:
            return "/dashboard";
    }
};

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Track whether we've attempted to restore session
    const initialized = useRef(false);

    // ── Hydrate session from localStorage on mount ───────────────────────────
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        try {
            const storedToken = localStorage.getItem("auth_token");
            const storedUser = localStorage.getItem("auth_user");

            if (storedToken && storedUser) {
                const parsedUser = JSON.parse(storedUser) as User;
                setToken(storedToken);
                setUser(parsedUser);
                api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            }
        } catch {
            // Corrupted storage — wipe it
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Login ────────────────────────────────────────────────────────────────
    const login = useCallback((newToken: string, newUser: User) => {
        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(newUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        setToken(newToken);
        setUser(newUser);
    }, []);

    // ── Logout ───────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // Ignore — still clear local state
        } finally {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            delete api.defaults.headers.common["Authorization"];
            setToken(null);
            setUser(null);
        }
    }, []);

    // ── Refresh user profile from server ────────────────────────────────────
    const refreshUser = useCallback(async () => {
        try {
            const { data } = await api.get<{ user: User }>("/auth/me");
            setUser(data.user);
            localStorage.setItem("auth_user", JSON.stringify(data.user));
        } catch {
            // If 401, api.ts interceptor handles refresh or redirects
        }
    }, []);

    const redirectPath = user ? getRoleRedirect(user.role) : "/dashboard";

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                loading,
                redirectPath,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
