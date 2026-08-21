import {createContext, useContext} from "react";
import type {AccountInfo} from "../models/Auth.ts";

export interface AuthContextValue {
    account: AccountInfo | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<AccountInfo>;
    register: (email: string, password: string) => Promise<AccountInfo>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}
