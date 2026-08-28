import { archiveUser, unarchiveUser} from "../services/users";
import { archiveEvent, unarchiveEvent } from "../services/events";
import { deleteAttendance } from "../services/attendance";
import { ApiError } from "../services/error";
import { logout } from "../services/auth";


export const useArchive = () => {
    const useArchiveStudent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await archiveUser(id);
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
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
            setError("Failed to archive data.");
            console.error("Error archiving user:", e);
            throw e;
        }
    }
    
    const useUnarchiveStudent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await unarchiveUser(id);
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
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
            setError("Failed to unarchive data.");
            console.error("Error unarchiving user:", e);
            throw e;
        }
    }
    
    const useArchiveEvent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await archiveEvent(id);
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

    const useUnarchiveEvent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await unarchiveEvent(id);
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
    
    const useDeleteAttendance = async (attendanceId: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await deleteAttendance(attendanceId);
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
                    setError(e.message || "Attendance record not found.");
                } 
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("Failed to delete data.");
            console.error("Error deleting attendance:", e);
            throw e;
        }
    }
    
    return { useArchiveStudent, useUnarchiveStudent, useArchiveEvent, useUnarchiveEvent, useDeleteAttendance };
}