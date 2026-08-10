import { logout } from "../services/auth.ts";
import { updateUser, type User } from "../services/users.ts";
import { updateEvent, type Event } from "../services/events.ts";

export const useUpdate = () => {
    const useUpdateUser = async (data: User, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const response = await updateUser(data.id, data);
            const responseData = await response.json();
            if (response.status === 401) {
                alert("Unauthorized. Redirecting to login.");
                await logout("/admin-login");
                throw new Error("Unauthorized. Redirecting to login.");
            }
            if (response.status === 403) {
                setError("Access denied. You do not have permission to perform this action.");
                throw new Error("Access denied. You do not have permission to perform this action.");
            }
            if (response.status === 404) {
                setError("User not found.");
                throw new Error("User not found.");
            }
            if (!response.ok) {
                alert("Something went wrong. Please try again later.");
                setError(responseData.message || "Failed to update data.");
                throw new Error(responseData.message || "Failed to update data.");
            }
            return responseData.user;
        } catch (error) {
            alert("Something went wrong. Please try again later.");
            console.error("Error updating data:", error);
            throw error;
        }
    }
    
    const useUpdateEvent = async (data: Event, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const response = await updateEvent(data.id, data);
            const responseData = await response.json();
            if (response.status === 401) {
                alert("Unauthorized. Redirecting to login.");
                await logout("/admin-login");
                throw new Error("Unauthorized. Redirecting to login.");
            }
            if (response.status === 403) {
                setError("Access denied. You do not have permission to perform this action.");
                throw new Error("Access denied. You do not have permission to perform this action.");
            }
            if (response.status === 404) {
                setError("Event not found.");
                throw new Error("Event not found.");
            }
            if (!response.ok) {
                alert("Something went wrong. Please try again later.");
                setError(responseData.message || "Failed to update data.");
                throw new Error(responseData.message || "Failed to update data.");
            }
            return responseData.event;
        } catch (error) {
            alert("Something went wrong. Please try again later.");
            console.error("Error updating data:", error);
            throw error;
        }
    }
    return { useUpdateUser, useUpdateEvent };
}