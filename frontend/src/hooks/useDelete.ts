import { deleteUser } from "../services/users";
import { deleteEvent } from "../services/events";
import { ApiError } from "../services/error";
import { logout } from "../services/auth";

export const useDelete = () => {
    const useDeleteStudent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await deleteUser(id);
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status === 404) {
                    setError(e.message || "User not found.");
                } 
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("Failed to delete data.");
            console.error("Error deleting user:", e);
            throw e;
        }
    }
    
    const useDeleteEvent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await deleteEvent(id);
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status === 404) {
                    setError(e.message || "Event not found.");
                } 
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("Failed to delete data.");
            console.error("Error deleting event:", e);
            throw e;
        }
    }
    
    return { useDeleteStudent, useDeleteEvent };
}