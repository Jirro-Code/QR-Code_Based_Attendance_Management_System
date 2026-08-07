import useViewUsers from "../../hooks/useView.ts";
import type { User } from "../../services/users";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar.tsx";
import ListCell from "../../components/ListCell.tsx";
import UpdateCard from "../../components/UpdateCard.tsx";

function ManageUsers() {
    const { viewAllUsers, searchUsers } = useViewUsers();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userArray, setUserArray] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const refreshUserList = () => {
        viewAllUsers(setUserArray);
    }
    
    useEffect(() => {
        viewAllUsers(setUserArray);
    }, [setUserArray]);
    
    const handleSearch = async () => {
        const searchedUsers = await searchUsers(searchQuery);
        setUserArray(searchedUsers);
    };
    
    return (
        <div>
            <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} />
            <h1>Manage Users</h1>
            <p>This is the Manage Users page.</p>
            
            {userArray.map((user: { id: string; username: string; email: string; role: string }) => (
                
                    <ListCell key={user.id} user={user} onUpdate={() => setSelectedUser(user)} />
                
            ))}  
            {selectedUser && <UpdateCard userId={selectedUser.id} onUpdated={refreshUserList} />}
        </div>
    );
}
export default ManageUsers;