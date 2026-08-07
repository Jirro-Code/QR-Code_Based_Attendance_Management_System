import { GetAllUsers, SearchUsers, type User } from "../services/users";

function useViewUsers() {

    async function viewAllUsers(): Promise<User[]> {
        const response = await GetAllUsers();
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch users");
        }
        return data.users as User[];
    }
    
    async function searchUsers(query: string): Promise<User[]> {
        const response = await SearchUsers(query);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to search users");
        }
        return data.users as User[];
    }
    
    return { viewAllUsers, searchUsers };
}

export default useViewUsers;