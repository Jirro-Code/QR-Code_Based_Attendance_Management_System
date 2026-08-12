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
}

export const getSelf = async () => {
    const response = await apiFetch("/users/me", {
        method: "GET",
        credentials: "include"
    });
    return response.json();
}

export const getUsersByRole = (role: string) => {
    return apiFetch(`/users/role/${role}`, {
        method: "GET",
        credentials: "include"
    }).then((response) => response.json());
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

export const deleteUser = async (id: string) => {
    const response = await apiFetch(`/users/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    return response.json().catch(() => null);
}