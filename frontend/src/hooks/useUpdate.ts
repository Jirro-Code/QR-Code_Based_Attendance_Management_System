import { logout } from "../services/auth.ts";
import { updateUser, type User } from "../services/users.ts";
import { updateEvent, type Event } from "../services/events.ts";
import { ApiError } from "../services/error.ts";
import { updateAttendance } from "../services/attendance.ts";

export const useUpdate = () => {
    const useUpdateUser = async (data: User, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const responseData = await updateUser(data.id, data);
            return responseData.user;
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Bad request. Please check your input and try again.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Redirecting to login.");
                    await logout("/admin-login");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                } 
                if (e.status === 404) {
                    setError(e.message || "User not found.");
                }
                if (e.status === 409) {
                    setError(e.message || "Conflict. The email, student ID, or LRN may already be in use.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("Failed to update data.");
            console.error("Error updating data:", e);
            throw e;
        }
    }
    
    const useUpdateEvent = async (data: Event, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const responseData = await updateEvent(data.id, data);
            return responseData.event;
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Bad request. Please check your input and try again.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Redirecting to login.");
                    await logout("/admin-login");
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
            setError("Failed to update data.");
            console.error("Error updating data:", e);
            throw e;
        }
    }
    
    const useUpdateAttendance = async (attendanceId: string, isLate: boolean, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const responseData = await updateAttendance(attendanceId, isLate);
            return responseData.attendance;
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 401) {
                    alert("Unauthorized. Redirecting to login.");
                    await logout("/admin-login");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status === 404) {
                    setError(e.message || "Attendance record not found.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("Failed to update data.");
            console.error("Error updating data:", e);
            throw e;
        }
    }
    
    return { useUpdateUser, useUpdateEvent, useUpdateAttendance };
}