import { apiFetch } from "./http";

export interface Event {
    eventName: string;
    eventDescription: string;
    eventDate: string;
    eventLocation: string;
}

export const getAllEvents = () => {
    return apiFetch("/events/all", {
        method: "GET",
        credentials: "include"
    });
}

export const createEvent = (eventData: Event) => {
    return apiFetch("/events/create", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(eventData),
        headers: {
            "Content-Type": "application/json"
        }
    });
}