export type AuthRole = "ROLE_USER" | "ROLE_ADMIN";

export interface AccountInfo {
    email: string;
    role: AuthRole;
}

export interface AuthResponse extends AccountInfo {
    token: string;
    expiresAt: number;
}
