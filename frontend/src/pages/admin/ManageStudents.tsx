import { useView } from "../../hooks/useView.ts";
import { type User } from "../../services/users";
import { useEffect, useState } from "react";
import { SearchBar } from "../../components/SearchBar.tsx";
import { BackButton } from "../../components/Button/Button.tsx";
import { ListCell } from "../../components/ListCell.tsx";
import { UpdateUserCard } from "../../components/Cards/UpdateUserCard.tsx";
import { DeleteUserCard } from "../../components/Cards/DeleteUserCard.tsx";
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx";
import { ViewStudentCard } from "../../components/Cards/ViewStudentCard.tsx";


export const ManageUsers = () => {
    const { useViewAllUsers, useSearchUsers } = useView();
    const [error, setError] = useState<string>("");
    const [isOnSearch, setIsOnSearch] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);
    const [userArray, setUserArray] = useState<Partial<User>[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
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
            refreshUserList();
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
        }
        else {
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            setShowViewCard(false);
            setError("");
            setIsOnSearch(false);
            await useViewAllUsers(setUserArray);
        }
    }
    
    const loadViewCard = (user: Partial<User>) => {
        setSelectedUser(user);
        setShowViewCard(true);
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowNotification(false);
    };
    
    const loadUpdateCard = (user: Partial<User>) => {
        setSelectedUser(user);
        setShowUpdateCard(true);
        setShowDeleteCard(false);
        setShowViewCard(false);
        setShowNotification(false);
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
                    <ListCell key={user.id} user={user} onUpdate={() => loadUpdateCard(user)} onDelete={() => {setSelectedUser(user), setShowUpdateCard(false), setShowViewCard(false), setShowNotification(false);}} onLoadUpdate={() => setShowUpdateCard(true)} onLoadDelete={() => setShowDeleteCard(true)} onLoadView={() => {loadViewCard(user)}} />
                ))
            ) : (
                <p>No users found.</p>
            )}
            
            {showUpdateCard && selectedUser && <UpdateUserCard userId={selectedUser.id!} onUpdated={refreshUserList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage}/>}            
            {showDeleteCard && selectedUser && <DeleteUserCard userId={selectedUser.id!} onDeleted={refreshUserList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} />}
            {showViewCard && selectedUser && <ViewStudentCard student={selectedUser} onClose={refreshUserList} />}
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
        </div>
    );
}