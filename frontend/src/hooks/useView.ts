import { logout } from "../services/auth.ts";
import { getAllEvents, getEventById, searchEvents, type Event } from "../services/events.ts";
import { getProfilePictureById, getUserById, getUsersByRole, searchUsers, type User } from "../services/users.ts";
import { ApiError } from "../services/error.ts";
import { getAllAttendanceByStudentId, getAllEventWithAttendance, getAllArchivedEventWithAttendance, getAttendanceByEventId, getEventWithAttendanceByStrandAndSection, checkAttendance } from "../services/attendance.ts";
import { type Attendance } from "../services/attendance.ts";

export const useView = () => {
    const useViewUser = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<User> => {
        try {
            const data = await getUserById(id);
            return data.user as User;
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 404) {
                    setError(e.message || "User not found.");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while fetching the user. Please try again.");
            console.error("Error fetching user:", e);
            throw e;
        }
    }
    
    const useViewProfilePicture = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<string> => {
        try {
            const data = await getProfilePictureById(id);
            return data.url as string;
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 404) {
                    setError(e.message || "Profile picture not found.");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while fetching the profile picture. Please try again.");
            console.error("Error fetching profile picture:", e);
            throw e;
        }
    }
    
    const useViewAllUsers = async (setUserArray: (users: User[]) => void, setError: React.Dispatch<React.SetStateAction<string>>) => {
        const fetchUsers = async () => {
            try {
                const data = await getUsersByRole("user");
                setUserArray(data.users);
            } 
            catch (e) {
                if (e instanceof ApiError) {
                    if (e.status === 400) {
                        setError(e.message || "Invalid request.");
                    }
                    if (e.status === 401) {
                        alert("Unauthorized. Please log in.");
                        await logout("/admin-login");
                    }
                    if (e.status === 403) {
                        setError(e.message || "Access denied. You do not have permission to perform this action.");
                    }
                    if (e.status === 404) {
                        return [];
                    }
                    if(e.status >= 500) {
                        alert("Server error. Please try again later.");
                        setError("Server error. Please try again later.");
                    }
                    throw e;
                }
                alert("Something went wrong. Please try again later.");
                setError("An error occurred while fetching users. Please try again.");
                console.error("Error fetching users:", e);
                throw e;
            }
        };
        
        fetchUsers();
    }
    
    const useSearchUsers = async (query: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<User[]> => {
        try {
            const data = await searchUsers(query);
            return data.users as User[];
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request. Please check your input.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 404) {
                    return [];
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while searching for users. Please try again.");
            console.error("Error searching for users:", e);
            throw e;
        }
    }
    
    const useViewAllEvents = async (setEventArray: (events: Event[]) => void, setError: React.Dispatch<React.SetStateAction<string>>) => {
        const fetchEvents = async () => {
            try {
                const data = await getAllEvents();
                setEventArray(data.events);
            } 
            catch (e) {
                if (e instanceof ApiError) {
                    if (e.status === 400) {
                        setError(e.message || "Invalid request.");
                    }
                    if (e.status === 401) {
                        alert("Unauthorized. Please log in.");
                        await logout("/admin-login");//TODO: Change this to /admin-login if the user is an admin, or / if the user is a student
                    }
                    if (e.status === 403) {
                        setError("Access denied. You do not have permission to perform this action.");
                    }
                    if (e.status === 404) {
                        return [];
                    }
                    if(e.status >= 500) {
                        alert("Server error. Please try again later.");
                        setError("Server error. Please try again later.");
                    }
                    throw e;
                }
                alert("Something went wrong. Please try again later.");
                setError("An error occurred while fetching events. Please try again.");
                console.error("Error fetching events:", e);
                throw e;
            }
        };
        return fetchEvents();
    }
    
    const useViewEventById = async (eventId: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<Event> => {
        try {
            const data = await getEventById(eventId);
            return data.event as Event;
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 404) {
                    setError(e.message || "Event not found.");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");             
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while fetching the event. Please try again.");
            console.error("Error fetching event:", e);
            throw e;
        }
    }
    
    const useSearchEvents = async (query: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<Event[]> => {
        try {
            const data = await searchEvents(query);
            setError(""); 
            return data.events as Event[];
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request. Please check your input.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");//TODO: Change this to /admin-login if the user is an admin, or / if the user is a student
                }
                if (e.status === 404) {
                    return [];
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while searching for events. Please try again.");
            console.error("Error searching for events:", e);
            throw e;
        }
    }
    
    const useCheckAttendance = async (eventId: string, userId: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<{ canMark: boolean }> => {
        try {
            const data = await checkAttendance(eventId, userId);
            return data as { canMark: boolean };
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 404) {
                    setError(e.message || "Attendance record not found.");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while checking attendance. Please try again.");
            console.error("Error checking attendance:", e);
            throw e;
        }
    }
    
    const useViewAttendanceByStudentId = async (userId: string, path: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<Attendance[]> => {
        try{
            const data = await getAllAttendanceByStudentId(userId);
            return data.attendance as Attendance[];
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout(path);
                }
                if (e.status === 404) {
                    return [];
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while fetching attendance records. Please try again.");
            console.error("Error fetching attendance records:", e);
            throw e;
        }
    }
    
    const useViewAttendanceByEventId = async (eventId: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<Attendance[]> => {
        try {
            const data = await getAttendanceByEventId(eventId);
            return data.attendance as Attendance[];
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 404) {
                    return [];
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while fetching attendance records. Please try again.");
            console.error("Error fetching attendance records:", e);
            throw e;
        }
    }
    
    const useViewEventWithAttendanceByStrandAndSection = async (strand: string | null, section: string | null,  archived: boolean, setError: React.Dispatch<React.SetStateAction<string>>): Promise<Event[]> => {
        try {
            const data = await getEventWithAttendanceByStrandAndSection(strand, section, archived);
            return data.events as Event[];
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 403) {
                    setError("Access denied. You do not have permission to perform this action.");
                }
                if (e.status === 404) {
                    return [];
                }
                if(e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while fetching events. Please try again.");
            console.error("Error fetching events:", e);
            throw e;
        }
    }
    
    const useViewAllEventsWithAttendanceRecords = async (setEventArray: (events: Event[]) => void, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const data = await getAllEventWithAttendance();
            setEventArray(data.events as Event[]);
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 403) {
                    setError("Access denied. You do not have permission to perform this action.");
                }
                if (e.status === 404) {
                    return [];
                }
                if(e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while fetching events. Please try again.");
            console.error("Error fetching events:", e);
            throw e;
        }
    }
    
    const useViewAllEventsWithArchivedAttendanceRecords = async (setEventArray: (events: Event[]) => void, setError: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const data = await getAllArchivedEventWithAttendance();
            setEventArray(data.events as Event[]);
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid request.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 403) {
                    setError("Access denied. You do not have permission to perform this action.");
                }
                if (e.status === 404) {
                    return [];
                }
                if(e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred while fetching events. Please try again.");
            console.error("Error fetching events:", e);
            throw e;
        }
    }
    
    return { useViewUser, useViewProfilePicture, useViewAllUsers, useSearchUsers, useCheckAttendance, useViewAttendanceByStudentId, useViewAllEventsWithArchivedAttendanceRecords, useViewAllEvents, useViewEventById, useSearchEvents, useViewAttendanceByEventId, useViewEventWithAttendanceByStrandAndSection, useViewAllEventsWithAttendanceRecords };
}
