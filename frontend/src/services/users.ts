import {apiFetch} from "./http";

export type UserData = {
    id: string;
    username: string;
    email: string;
    role: "admin" | "user";
};

export function getUerById () {
    return apiFetch("/users/me", {
        method: "GET",
        credentials: "include"
    });
}