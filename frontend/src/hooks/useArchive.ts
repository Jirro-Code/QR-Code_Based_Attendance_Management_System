import { archiveUser, unarchiveUser} from "../services/users";
import { archiveEvent, unarchiveEvent } from "../services/events";
import { archiveAttendance, unarchiveAttendance } from "../services/attendance";
import { ApiError } from "../services/error";
import { logout } from "../services/auth";


export const useArchive = () => {
    const useArchiveStudent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await archiveUser(id);
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Failed to archive user. User may already archived.");
                }
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
                if (e.status === 400) {
                    setError(e.message || "Failed to unarchive user. The user may not be archived.");
                }
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
                if (e.status === 400) {
                    setError(e.message || "Failed to archive event. The event may already be archived.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
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
            setError("Failed to unarchive data.");
            console.error("Error unarchiving event:", e);
            throw e;
        }
    }
    
    const useUnarchiveEvent = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await unarchiveEvent(id);
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Failed to unarchive event. The event may not be archived.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
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
            setError("Failed to delete data.");
            console.error("Error deleting event:", e);
            throw e;
        }
    }
    
    const useArchiveAttendance = async (attendanceId: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await archiveAttendance(attendanceId);
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Failed to archive attendance. Attendance may already archived.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
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
            setError("Failed to archive data.");
            console.error("Error archiving attendance:", e);
            throw e;
        }
    };
    
    const useUnarchiveAttendance = async (attendanceId: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            await unarchiveAttendance(attendanceId);
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Failed to unarchive attendance. The user or event may be archived.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
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
            setError("Failed to unarchive data.");
            console.error("Error unarchiving attendance:", e);
            throw e;
        }
    }
    
    return { useArchiveStudent, useUnarchiveStudent, useArchiveEvent, useUnarchiveEvent,  useArchiveAttendance, useUnarchiveAttendance };
}