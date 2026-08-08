import { apiFetch } from "./http";

export interface Event {
    eventId: string;
    eventName: string;
    eventDescription: string;
    eventDate: string;
    eventLocation: string;
    creator: string;
    createdAt?: string;
    updatedAt?: string;
}

export const GetAllEvents = () => {
    return apiFetch("/events/all", {
        method: "GET",
        credentials: "include"
    });
}