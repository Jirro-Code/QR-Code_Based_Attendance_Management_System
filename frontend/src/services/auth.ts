import { apiFetch } from "./http";

export type LoginPayload =
    | { role: "admin"; email: string; password: string }
    | { role: "user"; studentId: string; password: string };

export type StudentRegisterPayload = {
    role: "user";
    profilePicture: File | null;
    username: string;
    email: string;
    password: string;
    studentLRN: string;
    studentId: string;
    studentStrand: string;
    studentSection: string;
};

export type AdminRegisterPayload = {
    role: "admin";
    username: string;
    email: string;
    password: string;
};

export type RegisterPayload = StudentRegisterPayload | AdminRegisterPayload;

export const register = async (data: RegisterPayload) => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, String(value));
            }
        }
    });
    
    
    const response = await apiFetch("/auth/register", {
        method: "POST",
        body: formData
    });
    return response.json();
}

export const login = async (payload: LoginPayload) => {
    const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
    });
    return response.json().catch(() => null);
}

export const logout = async (path: string) => {
    try{
        await apiFetch("/auth/logout", {
            method: "POST"
        });
        window.location.href = path;
    }
    catch(e){
        console.error("Error during logout:", e);
        alert("An error occurred during logout. Please try again.");
    }
}