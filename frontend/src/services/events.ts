import { apiFetch } from "./http";

export interface Event {
    eventName: string;
    eventDescription: string;
    eventDate: string;
    eventLocation: string;
    creator: string;
    id: string;
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
    }).then((response) => response.json());
}

export const getAllEvents = () => {
    return apiFetch("/events/all", {
        method: "GET",
        credentials: "include"
    }).then((response) => response.json());
}

export const searchEvents = async (query: string) => {
    const response = await apiFetch(`/events/search?search=${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include"
    });
    return response.json();
}

export const updateEvent = async (id: string, eventData: Partial<Event>) => {
    const response = await apiFetch(`/events/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(eventData),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    return response.json();
}

export const deleteEvent = async (id: string) => {
    const response = await apiFetch(`/events/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    return response.json().catch(() => null);
}