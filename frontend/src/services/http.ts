import { ApiError } from "./error";

const API_BASE_URL = "http://localhost:3000/api";

export const apiFetch = async (path: string, init: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(init.headers ?? {})
        }
    });
    
    if (!response.ok) {
        let message = "";
        const contentType = response.headers.get("content-type") ?? "";
        
        if (contentType.includes("application/json")) {
            const errorData = await response.json().catch(() => null) as { message?: string } | null;
            message = errorData?.message ?? "";
        } else {
            message = await response.text().catch(() => "");
        }
        
        throw new ApiError(message || response.statusText || "Request failed.", response.status);
    }
    
    return response;
}