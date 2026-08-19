import { logout } from "../services/auth.ts";
import { getAllEvents, searchEvents, type Event } from "../services/events.ts";
import { getUserById, getUsersByRole, searchUsers, type User } from "../services/users.ts";
import { ApiError } from "../services/error.ts";
import { getAttendanceByEventId } from "../services/attendance.ts";
import { type Attendance } from "../services/attendance.ts";

export const useView = () => {
    const useViewUser = async (id: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<User> => {
        try {
            const data = await getUserById(id);
            return data.user as User;
        } catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/");
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
    const useViewAllUsers = async (setUserArray: React.Dispatch<React.SetStateAction<Partial<User>[]>>, setError: React.Dispatch<React.SetStateAction<string>>) => {
        const fetchUsers = async () => {
            try {
                const data = await getUsersByRole("user");
                setUserArray(data.users);
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
                        setError(e.message || "No users found.");
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
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/");
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
                    if (e.status === 401) {
                        alert("Unauthorized. Please log in.");
                        await logout("/");
                    }
                    if (e.status === 403) {
                        setError("Access denied. You do not have permission to perform this action.");
                    }
                    if (e.status === 404) {
                        setError("No events found.");
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
    
    const useSearchEvents = async (query: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<Event[]> => {
        try {
            const data = await searchEvents(query);
            setError(""); 
            return data.events as Event[];
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/");
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
    
    const useViewAttendanceByEventId = async (eventId: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<Attendance[]> => {
        try {
            const data = await getAttendanceByEventId(eventId);
            return data.attendance as Attendance[];
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/");
                }
                if (e.status === 404) {
                    setError(e.message || "No attendance records found for the specified event.");
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

    return { useViewUser, useViewAllUsers, useSearchUsers, useViewAllEvents, useSearchEvents, useViewAttendanceByEventId };
}
