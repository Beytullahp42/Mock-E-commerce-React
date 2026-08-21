import api from "./api.ts";
import type {AccountInfo, AuthResponse} from "../models/Auth.ts";

export async function register(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/register", {email, password});
    return response.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/login", {email, password});
    return response.data;
}

export async function getMe(): Promise<AccountInfo> {
    const response = await api.get<AccountInfo>("/api/auth/me");
    return response.data;
}
