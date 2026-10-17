import { ApiError } from "./error";

const API_BASE_URL = "https://attendscan-api-dff6e5hzd0gwhzb7.southeastasia-01.azurewebsites.net/api";
//const API_BASE_URL = "https://localhost:3000/api";
let redirectingAfterUnauthorized = false;

const handleUnauthorized = () => {
    if (redirectingAfterUnauthorized || window.location.pathname.endsWith("-login")) return;
    redirectingAfterUnauthorized = true;
    const loginPath = window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/manage")
        || window.location.pathname.startsWith("/create") || window.location.pathname.startsWith("/archived")
        || window.location.pathname === "/scanner"
        ? "/admin-login"
        : "/student-login";
    
    void fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    }).finally(() => window.location.replace(`${loginPath}?reason=unauthorized`));
};

export const apiFetch = async (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    if (!(init.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        credentials: "include",
        headers
    });
    
    if (!response.ok) {
        if (response.status === 401 && !path.startsWith("/auth/login") && !path.startsWith("/auth/logout")) {
            handleUnauthorized();
        }
        let message = "";
        const contentType = response.headers.get("content-type") ?? "";
        
        if (contentType.includes("application/json")) {
            const errorData = await response.json().catch(() => null) as ({ message?: string } & Record<string, unknown>) | null;
            message = errorData?.message ?? "";
            throw new ApiError(message || response.statusText || "Request failed.", response.status, errorData ?? {});
        } else {
            message = await response.text().catch(() => "");
        }
        
        throw new ApiError(message || response.statusText || "Request failed.", response.status);
    }
    
    return response;
}