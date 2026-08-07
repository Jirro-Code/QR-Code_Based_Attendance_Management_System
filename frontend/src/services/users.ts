import {apiFetch} from "./http";

export type UserData = {
    id: string;
    username: string;
    email: string;
    role: "admin" | "user";
};

export async function getUserById() {
    return apiFetch("/users/me", {
        method: "GET",
        credentials: "include"
    });
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    studentId?: string;
    studentLRN?: string;
    studentStrand?: string;
    studentSection?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const GetAllUsers = () => {
    return apiFetch("/users/all", {
        method: "GET",
        credentials: "include"
    });
}

export const SearchUsers = async (query: string) => {
    return await apiFetch(`/users/search?search=${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include"
    });
}

export const UpdateUser = async (id: string, userData: Partial<User>) => {
    return await apiFetch(`/users/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
}