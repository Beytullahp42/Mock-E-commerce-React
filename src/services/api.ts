import axios from "axios";
import {BASE_URL} from "./BASE_URL.ts";

export const AUTH_TOKEN_KEY = "mock-ecommerce-token";

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            window.dispatchEvent(new Event("mock-ecommerce-unauthorized"));
        }
        return Promise.reject(error);
    }
);

export default api;
