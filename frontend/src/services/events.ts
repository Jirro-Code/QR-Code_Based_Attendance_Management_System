import { apiFetch } from "./http";

export interface Event {
    eventName: string;
    eventDescription: string;
    eventDate: string;
    eventLocation: string;
    creator: string;
    eventId: string;
}
export interface CreateEventData {
    eventName: string;
    eventDescription: string;
    eventDate: string;
    eventLocation: string;
}

export const createEvent = (eventData: CreateEventData) => {
    return apiFetch("/events/create", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(eventData),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getAllEvents = () => {
    return apiFetch("/events/all", {
        method: "GET",
        credentials: "include"
    });
}

export const searchEvents = async (query: string) => {
    return await apiFetch(`/events/search?search=${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include"
    });
}

export const updateEvent = async (id: string, eventData: Partial<Event>) => {
    return await apiFetch(`/events/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(eventData),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
}

export const deleteEvent = async (id: string) => {
    return await apiFetch(`/events/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
}