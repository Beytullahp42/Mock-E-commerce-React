import {useCallback, useEffect, useState, type ReactNode} from "react";
import type {AccountInfo} from "../models/Auth.ts";
import {getMe, login as loginRequest, register as registerRequest} from "../services/AuthService.ts";
import {AUTH_TOKEN_KEY} from "../services/api.ts";
import {AuthContext} from "./auth-context.ts";

export function AuthProvider({children}: {children: ReactNode}) {
    const [account, setAccount] = useState<AccountInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAccount(null);
    }, []);

    useEffect(() => {
        const handleUnauthorized = () => logout();
        window.addEventListener("mock-ecommerce-unauthorized", handleUnauthorized);

        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) {
            setLoading(false);
        } else {
            getMe()
                .then(setAccount)
                .catch(logout)
                .finally(() => setLoading(false));
        }

        return () => window.removeEventListener("mock-ecommerce-unauthorized", handleUnauthorized);
    }, [logout]);

    const login = async (email: string, password: string) => {
        const response = await loginRequest(email, password);
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        const accountInfo = {email: response.email, role: response.role};
        setAccount(accountInfo);
        return accountInfo;
    };

    const register = async (email: string, password: string) => {
        const response = await registerRequest(email, password);
        localStorage.setItem(AUTH_TOKEN_KEY, response.token);
        const accountInfo = {email: response.email, role: response.role};
        setAccount(accountInfo);
        return accountInfo;
    };

    return (
        <AuthContext.Provider value={{account, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
}
