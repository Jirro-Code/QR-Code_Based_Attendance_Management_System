import { logout } from "../services/auth";
import { GetAllUsers, SearchUsers, type User } from "../services/users";

function useViewUsers() {
    
    async function viewAllUsers(setUserArray: React.Dispatch<React.SetStateAction<User[]>>) {
        const fetchUsers = async () => {
            try {
                const response = await GetAllUsers();
                const data = await response.json();
                if(response.status === 401) {
                    await logout("/");
                    throw new Error(data?.message ?? "Unauthorized. Please log in.");
                }
                if(response.status === 403) {
                    throw new Error(data?.message ?? "Access denied. You do not have permission to perform this action.");
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
    
    
    async function searchUsers(query: string, setError: React.Dispatch<React.SetStateAction<string>>): Promise<User[]> {
        try {
            const response = await SearchUsers(query);
            const data = await response.json();
            if (response.status === 401) {
                await logout("/");
                throw new Error(data?.message ?? "Unauthorized. Please log in.");
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
    
    return { viewAllUsers, searchUsers, };
}

export default useViewUsers;