import {apiFetch} from "./http";

export interface User {
    role: "admin" | "user";
    id: string;
    username: string;
    email: string;
    password: string;
    studentId: string;
    studentLRN: string;
    studentStrand: string;
    studentSection: string;
    createdAt: string;
    updatedAt: string;
    isArchived: boolean;
}

export const getSelf = async () => {
    const response = await apiFetch("/users/me", {
        method: "GET",
        credentials: "include"
    });
    return response.json();
}

export const getUserById = async (id: string) => {
    const response = await apiFetch(`/users/userId/${id}`, {
        method: "GET",
        credentials: "include"
    });
    return response.json();
}

export const getUsersByRole = async (role: string) => {
    const response = await apiFetch(`/users/role/${role}`, {
        method: "GET",
        credentials: "include"
    });
    return response.json();
}

export const searchUsers = async (query: string) => {
    const response = await apiFetch(`/users/search?search=${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include"
    });
    return response.json();
}

export const updateUser = async (id: string, userData: Partial<User>) => {
    const response = await apiFetch(`/users/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    return response.json();
}

export const archiveUser = async (id: string) => {
    const response = await apiFetch(`/users/archive/${id}`, {
        method: "PATCH",
        credentials: "include"
    });
    return response.json().catch(() => null);
}

export const unarchiveUser = async (id: string) => {
    const response = await apiFetch(`/users/unarchive/${id}`, {
        method: "PATCH",
        credentials: "include"
    });
    return response.json().catch(() => null);
}