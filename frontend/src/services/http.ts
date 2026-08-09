const API_BASE_URL = "http://localhost:3000/api";

export const apiFetch = async (path: string, init: RequestInit = {}) => {
    return fetch(`${API_BASE_URL}${path}`, {
        ...init,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init.headers ?? {})
        }
    });
}