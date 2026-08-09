import { deleteUser } from "../services/users";
import { deleteEvent } from "../services/events";

export const useDelete = () => {
    const useDeleteStudent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const response = await deleteUser(id);
            const data = await response.json();
            if (response.status === 401) {
                alert("Unauthorized. Please log in.");
                setError("Unauthorized. Please log in.");
                throw new Error("Unauthorized. Please log in.");
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
                setError(data?.message || "Failed to delete data.");
                throw new Error(data?.message || "Failed to delete data.");
            }
            return data;
        } catch (error) {
            alert("Something went wrong. Please try again later.");
            console.error("Error deleting user:", error);
            throw error;
        }
    }
    
    const useDeleteEvent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const response = await deleteEvent(id);
            const data = await response.json();
            if (response.status === 401) {
                alert("Unauthorized. Please log in.");
                setError("Unauthorized. Please log in.");
                throw new Error("Unauthorized. Please log in.");
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
                setError(data?.message || "Failed to delete data.");
                throw new Error(data?.message || "Failed to delete data.");
            }
            return data;
        } catch (error) {
            alert("Something went wrong. Please try again later.");
            console.error("Error deleting event:", error);
            throw error;
        }
    }
    
    return { useDeleteStudent, useDeleteEvent };
}