import { logout } from "../services/auth.ts";
import { getAllEvents, searchEvents, type Event } from "../services/events.ts";
import { getAllUsers, searchUsers, type User } from "../services/users.ts";

export const useView = () => {
    const useViewAllUsers = async (setUserArray: React.Dispatch<React.SetStateAction<User[]>>) => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                const data = await response.json();
                if(response.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/");
                    throw new Error(data?.message ?? "Unauthorized. Please log in.");
                }
                if(response.status === 403) {
                    alert("Access denied. You do not have permission to perform this action.");
                    throw new Error(data?.message ?? "Access denied. You do not have permission to perform this action.");
                }
                if(response.status === 404) {
                    alert("No users found.");
                    setUserArray([]);
                    throw new Error(data?.message ?? "No users found.");
                }
                if (!response.ok) {
                    alert("Something went wrong. Please try again later.");
                    throw new Error(data?.message ?? "Failed to fetch users");
                }
                setUserArray(data.users);
            } 
            catch (error) {
                alert("Something went wrong. Please try again later.");
                throw new Error("An error occurred while fetching users. Please try again.");
            }
        };
        
        fetchUsers();
    }
    
    
    const useSearchUsers = async (query: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<User[]> => {
        try {
            const response = await searchUsers(query);
            const data = await response.json();
            if (response.status === 401) {
                alert("Unauthorized. Please log in.");
                await logout("/");
                throw new Error(data?.message ?? "Unauthorized. Please log in.");
            }
            if (response.status === 404) {
                setError("No users found matching the search query.");
                throw new Error(data?.message ?? "No users found matching the search query.");
            }
            if (response.status === 403) {
                setError("Access denied. You do not have permission to perform this action.");
                throw new Error(data?.message ?? "Access denied. You do not have permission to perform this action.");
            }
            if (!response.ok) {
                alert("Something went wrong. Please try again later.");
                setError(data?.message ?? "Failed to search users");
                throw new Error(data?.message ?? "Failed to search users");
            }
            return data.users as User[];
        } 
        catch (error) {
            alert("Something went wrong. Please try again later.");
            console.error("Error searching for users:", error);
            throw new Error("An error occurred while searching for users. Please try again.");
        }
    }
    
    
    const useViewAllEvents = async (setEventArray: React.Dispatch<React.SetStateAction<Event[]>>) => {
        const fetchEvents = async () => {
            try {
                const response = await getAllEvents();
                const data = await response.json();
                if(response.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/");
                    throw new Error(data?.message ?? "Unauthorized. Please log in.");
                }
                if(response.status === 403) {
                    alert("Access denied. You do not have permission to perform this action.");
                    throw new Error(data?.message ?? "Access denied. You do not have permission to perform this action.");
                }
                if(response.status === 404) {
                    setEventArray([]);
                    throw new Error(data?.message ?? "No events found.");
                }
                if (!response.ok) {
                    alert("Something went wrong. Please try again later.");
                    throw new Error(data?.message ?? "Failed to fetch events");
                }
                setEventArray(data.events);
            } 
            catch (error) {
                alert("Something went wrong. Please try again later.");
                console.error("Error fetching events:", error);
                throw new Error("An error occurred while fetching events. Please try again.");
            }
        };
        
        fetchEvents();
    }
    
    const useSearchEvents = async (query: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<Event[]> => {
        try {
            const response = await searchEvents(query);
            const data = await response.json();
            if (response.status === 401) {
                alert("Unauthorized. Please log in.");
                await logout("/");
                throw new Error(data?.message ?? "Unauthorized. Please log in.");
            }
            if (response.status === 404) {
                setError("No events found matching the search query.");
                throw new Error(data?.message ?? "No events found matching the search query.");
            }
            if (response.status === 403) {
                setError("Access denied. You do not have permission to perform this action.");
                throw new Error(data?.message ?? "Access denied. You do not have permission to perform this action.");
            }
            if (!response.ok) {
                alert("Something went wrong. Please try again later.");
                setError(data?.message ?? "Failed to search events");
                throw new Error(data?.message ?? "Failed to search events");
            }
            return data.events as Event[];
        } 
        catch (error) {
            alert("Something went wrong. Please try again later.");
            console.error("Error searching for events:", error);
            throw new Error("An error occurred while searching for events. Please try again.");
        }
    }
    return { useViewAllUsers, useSearchUsers, useViewAllEvents, useSearchEvents };
}
