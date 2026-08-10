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
    return apiFetch("/users/me", {
        method: "GET",
        credentials: "include"
    });
}

export const getUsersByRole = (role: string) => {
    return apiFetch(`/users/role/${role}`, {
        method: "GET",
        credentials: "include"
    });
}

export const searchUsers = async (query: string) => {
    return await apiFetch(`/users/search?search=${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include"
    });
}

export const updateUser = async (id: string, userData: Partial<User>) => {
    return await apiFetch(`/users/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

export const deleteUser = async (id: string) => {
    return await apiFetch(`/users/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
}