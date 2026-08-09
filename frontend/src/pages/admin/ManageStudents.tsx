import { useView } from "../../hooks/useView.ts";
import { type User } from "../../services/users";
import { useEffect, useState } from "react";
import { SearchBar } from "../../components/SearchBar.tsx";
import { BackButton } from "../../components/Button/Button.tsx";
import { ListCell } from "../../components/ListCell.tsx";
import { UpdateUserCard } from "../../components/Cards/UpdateUserCard.tsx";
import { DeleteUserCard } from "../../components/Cards/DeleteUserCard.tsx";
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx";


export const ManageUsers = () => {
    const { useViewAllUsers, useSearchUsers } = useView();
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
    
    useEffect(() => {
        useViewAllUsers(setUserArray);
    }, [setUserArray]);
    
    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            await useViewAllUsers(setUserArray);
            setIsOnSearch(false);
            return;
        }
        
        const searchedUsers = await useSearchUsers(searchQuery.trim(), setError);
        
        const filteredUsers = searchedUsers.filter((user: User) => user.role === "user");
        setUserArray(filteredUsers);
        setIsOnSearch(true);
    };
    
    const refreshUserList = async () => {
        if (isOnSearch) {
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            await handleSearch();
        }
        else {
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            setIsOnSearch(false);
            await useViewAllUsers(setUserArray);
        }
    }
    
    return (
        <div>
            <h1>Manage Users</h1>
            <p>This is the Manage Users page.</p>
            <BackButton path="/admin-dashboard" />
            <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} />
            <p>{error}</p>
            {userArray.length > 0 ? (
                userArray.map((user: { id: string; username: string; email: string; role: string }) => (
                    <ListCell key={user.id} user={user} onUpdate={() => {setSelectedUser(user), setShowDeleteCard(false)}} onDelete={() => {setSelectedUser(user), setShowUpdateCard(false);}} onLoadUpdate={() => setShowUpdateCard(true)} onLoadDelete={() => setShowDeleteCard(true)} />
                ))
            ) : (
                <p>No users found.</p>
            )}
            
            {showUpdateCard && selectedUser && <UpdateUserCard userId={selectedUser.id} onUpdated={refreshUserList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage}/>}            
            {showDeleteCard && selectedUser && <DeleteUserCard userId={selectedUser.id} onDeleted={refreshUserList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} />}
            
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
        </div>
    );
}