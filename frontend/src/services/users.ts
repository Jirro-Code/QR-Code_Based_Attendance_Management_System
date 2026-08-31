import {apiFetch} from "./http";

export interface User {
    role: "admin" | "user";
    id: string;
    profilePictureUrl: string | null;
    profilePicture: File | null;
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

export const getProfilePictureById = async (id: string) => {
    const response = await apiFetch(`/users/profile-picture/${id}`, {
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
    const formData = new FormData();
    
    Object.entries(userData).forEach(([key, value]) => {
        if (key === "profilePicture") return; 
        if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });
    
    if (userData.profilePicture) {
        formData.append("profilePicture", userData.profilePicture);
    }
    
    const response = await apiFetch(`/users/update/${id}`, {
        method: "PUT",
        body: formData,
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