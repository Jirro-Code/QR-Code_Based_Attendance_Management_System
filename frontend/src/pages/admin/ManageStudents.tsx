import { useView } from "../../hooks/useView.ts";
import { type User } from "../../services/users";
import { useEffect, useState } from "react";
import { SearchBar } from "../../components/SearchBar.tsx";
import { BackButton } from "../../components/Button/Button.tsx";
import { UserListCell } from "../../components/UserListCell.tsx";
import { UpdateUserCard } from "../../components/Cards/UpdateUserCard.tsx";
import { DeleteUserCard } from "../../components/Cards/DeleteUserCard.tsx";
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx";
import { ViewStudentCard } from "../../components/Cards/ViewStudentCard.tsx";


export const ManageUsers = () => {
    const { useViewAllUsers, useSearchUsers } = useView();
    const [error, setError] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);
    const [userArray, setUserArray] = useState<Partial<User>[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isOnSearch, setIsOnSearch] = useState<boolean>(false);
    const [showUpdateCard, setShowUpdateCard] = useState<boolean>(false);
    const [showDeleteCard, setShowDeleteCard] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [showViewCard, setShowViewCard] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    
    useEffect(() => {
        useViewAllUsers(setUserArray);
    }, [setUserArray]);
    
    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            setSearchQuery("");
            await useViewAllUsers(setUserArray);
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
            setShowViewCard(false);
            setError("");
            await handleSearch();
            return;
        }
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(false);
        setError("");
        setIsOnSearch(false);
        await useViewAllUsers(setUserArray);
    }
    
    const loadViewCard = (user: Partial<User>) => {
        setSelectedUser(user);
        setShowViewCard(true);
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowNotification(false);
    };
    
    const loadDeleteCard = (user: Partial<User>) => {
        setSelectedUser(user);
        setShowDeleteCard(true);
        setShowUpdateCard(false);
        setShowViewCard(false);
        setShowNotification(false);
    };
    
    const loadUpdateCard = (user: Partial<User>) => {
        setSelectedUser(user);
        setShowUpdateCard(true);
        setShowDeleteCard(false);
        setShowNotification(false);
    }
    
    const updateNotification = async (updatedUser: Partial<User>) => {
        if (isOnSearch) {
            setSelectedUser(updatedUser);
            setUserArray((prevUsers) => prevUsers.map((user) => user.id === updatedUser.id ? updatedUser : user));
            setShowUpdateCard(false);
            setShowViewCard(true);
            setShowDeleteCard(false);
            setShowNotification(true);  
            await handleSearch();
            return;
        }
        setSelectedUser(updatedUser);
        setUserArray((prevUsers) => prevUsers.map((user) => user.id === updatedUser.id ? updatedUser : user));
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(true);
        setShowNotification(true);  
        setIsOnSearch(false);
        await useViewAllUsers(setUserArray);           
    }
    
    return (
        <div>
            <h1>Manage Users</h1>
            <p>This is the Manage Users page.</p>
            <BackButton path="/admin-dashboard" />
            <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
            <p>{error}</p>
            
            {userArray.length > 0 ? (
                userArray.map((user: Partial<User>) => (
                    <UserListCell key={user.id} user={user} onDelete={() => loadDeleteCard(user)} onLoadView={() => {loadViewCard(user)}} />
                ))
            ) : 
            (
                <p>No users found.</p>
            )}
            
            {showUpdateCard && selectedUser && <UpdateUserCard userId={selectedUser.id!} onUpdated={(updatedUser) => {updateNotification(updatedUser);}} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowUpdateCard(false)} />}            
            {showDeleteCard && selectedUser && <DeleteUserCard userId={selectedUser.id!} onDeleted={refreshUserList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowDeleteCard(false)} />}
            {showViewCard && selectedUser && <ViewStudentCard student={selectedUser} onUpdate={() => loadUpdateCard(selectedUser)} onClose={() => {setShowViewCard(false), setShowUpdateCard(false), setShowNotification(false)}} />}
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
        </div>
    );
}