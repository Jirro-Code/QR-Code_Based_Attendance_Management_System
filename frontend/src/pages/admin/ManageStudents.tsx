import useViewUsers from "../../hooks/useViewUsers";
import type { User } from "../../services/users";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar.tsx";

function ManageUsers() {
    const { viewAllUsers, searchUsers } = useViewUsers();
    const [userArray, setUserArray] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await viewAllUsers();
                setUserArray(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        
        fetchUsers();
    }, []);
    
    const handleSearch = async () => {
        const searchedUsers = await searchUsers(searchQuery);
        setUserArray(searchedUsers);
    };
    
    return (
        <div>
            <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} />
            <h1>Manage Users</h1>
            <p>This is the Manage Users page.</p>
            <ul>
                {userArray.map((user: { id: string; username: string; email: string; role: string }) => (
                    <li key={user.id}>
                        ID: {user.id}, Username: {user.username}, Email: {user.email}, Role: {user.role}
                    </li>
                ))}
            </ul>
            
        </div>
    );
}

export default ManageUsers;