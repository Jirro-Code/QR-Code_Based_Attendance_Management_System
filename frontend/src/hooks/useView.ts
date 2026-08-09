import { logout } from "../services/auth";
import { getAllEvents, type Event } from "../services/events";
import { getAllUsers, searchUsers, type User } from "../services/users";

export const useView = () => {
    const useViewAllUsers = async (setUserArray: React.Dispatch<React.SetStateAction<User[]>>) => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                const data = await response.json();
                if(response.status === 401) {
                    await logout("/");
                    throw new Error(data?.message ?? "Unauthorized. Please log in.");
                }
                if(response.status === 403) {
                    throw new Error(data?.message ?? "Access denied. You do not have permission to perform this action.");
                }
                if(response.status === 404) {
                    setUserArray([]);
                    throw new Error(data?.message ?? "No users found.");
                }
                if (!response.ok) {
                    throw new Error(data?.message ?? "Failed to fetch users");
                }
                setUserArray(data.users);
            } 
            catch (error) {
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
                setError(data?.message ?? "Failed to search users");
                throw new Error(data?.message ?? "Failed to search users");
            }
            return data.users as User[];
        } 
        catch (error) {
            throw new Error("An error occurred while searching for users. Please try again.");
        }
    }
    
    const useViewAllEvents = async (setEventArray: React.Dispatch<React.SetStateAction<Event[]>>) => {
        const fetchEvents = async () => {
            try {
                const response = await getAllEvents();
                const data = await response.json();
                if(response.status === 401) {
                    await logout("/");
                    throw new Error(data?.message ?? "Unauthorized. Please log in.");
                }
                if(response.status === 403) {
                    throw new Error(data?.message ?? "Access denied. You do not have permission to perform this action.");
                }
                if(response.status === 404) {
                    setEventArray([]);
                    throw new Error(data?.message ?? "No events found.");
                }
                if (!response.ok) {
                    throw new Error(data?.message ?? "Failed to fetch events");
                }
                setEventArray(data.events);
            } 
            catch (error) {
                throw new Error("An error occurred while fetching events. Please try again.");
            }
        };
        
        fetchEvents();
    }
    return { useViewAllUsers, useSearchUsers, useViewAllEvents };
}
