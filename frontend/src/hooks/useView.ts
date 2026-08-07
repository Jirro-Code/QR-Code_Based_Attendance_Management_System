import { GetAllUsers, SearchUsers, type User } from "../services/users";

function useViewUsers() {
    
    async function viewAllUsers(setUserArray: React.Dispatch<React.SetStateAction<User[]>>) {
        
        const fetchUsers = async () => {
            try {
                const response = await GetAllUsers();
                const data = await response.json();
                
                setUserArray(data.users);
            } 
            catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        
        fetchUsers();
    }
    
    
    async function searchUsers(query: string): Promise<User[]> {
        const response = await SearchUsers(query);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to search users");
        }
        return data.users as User[];
    }
    
    return { viewAllUsers, searchUsers, };
    
}

export default useViewUsers;