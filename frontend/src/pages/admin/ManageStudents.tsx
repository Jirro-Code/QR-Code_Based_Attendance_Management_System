import useViewUsers from "../../hooks/useView.ts";
import type { User } from "../../services/users";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar.tsx";
import {BackButton} from "../../components/Button/Button.tsx";
import ListCell from "../../components/ListCell.tsx";
import UpdateCard from "../../components/cards/UpdateCard.tsx";
import DeleteCard from "../../components/cards/DeleteCard.tsx";
import NotificationCard from "../../components/cards/NotificationCard.tsx";


function ManageUsers() {
    
    const { viewAllUsers, searchUsers } = useViewUsers();
    const [error, setError] = useState<string>("");
    const [isOnSearch, setIsOnSearch] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userArray, setUserArray] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showUpdateCard, setShowUpdateCard] = useState<boolean>(false);
    const [showDeleteCard, setShowDeleteCard] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    
    const refreshUserList = () => {
        if (isOnSearch) {
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            handleSearch();
        }
        else {
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            setIsOnSearch(false);
            viewAllUsers(setUserArray);
        }
    }
    
    useEffect(() => {
        viewAllUsers(setUserArray);
    }, [setUserArray]);
    
    const handleSearch = async () => {
        if (searchQuery === "") {
            viewAllUsers(setUserArray);
            setIsOnSearch(false);
            return;
        }
        const searchedUsers = await searchUsers(searchQuery, setError);
        setUserArray(searchedUsers);
        setIsOnSearch(true);
    };
    
    
    return (
        <div>
            <h1>Manage Users</h1>
            <p>This is the Manage Users page.</p>
            <BackButton path="/admin-dashboard" />
            <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} />
            <p>{error}</p>
            {userArray.length > 0 ? (
                userArray.map((user: { id: string; username: string; email: string; role: string }) => (
                    <ListCell key={user.id} user={user} onUpdate={() => setSelectedUser(user)} onDelete={() => {setSelectedUser(user)}}
                                                        onLoadUpdate={() => setShowUpdateCard(true)} onLoadDelete={() => setShowDeleteCard(true)} />
                ))
            ) : (
                <p>No users found.</p>
            )}
            
            {showUpdateCard && selectedUser && <UpdateCard userId={selectedUser.id} onUpdated={refreshUserList} onSetNotif={setNotificationMessage} setShowNotification={setShowNotification} />}            
            {showDeleteCard && selectedUser && <DeleteCard userId={selectedUser.id} onDeleted={refreshUserList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} />}
            
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
        </div>
    );
}
export default ManageUsers;