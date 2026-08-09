import {apiFetch} from "./http";

export type UserData = {
    id: string;
    username: string;
    email: string;
    role: "admin" | "user";
};

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    password?: string;
    studentId?: string;
    studentLRN?: string;
    studentStrand?: string;
    studentSection?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const getUserById = async () => {
    return apiFetch("/users/me", {
        method: "GET",
        credentials: "include"
    });
}

export const getAllUsers = () => {
    return apiFetch("/users/role/user", {
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