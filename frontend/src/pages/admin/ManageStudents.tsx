import { useView } from "../../hooks/useView.ts";
import { type User } from "../../services/users";
import { useEffect, useState } from "react";
import { SearchBar } from "../../components/SearchBar.tsx";
import { UserListCell } from "../../components/UserListCell.tsx";
import { UpdateUserCard } from "../../components/Cards/UpdateUserCard.tsx";
import { DeleteUserCard } from "../../components/Cards/DeleteUserCard.tsx";
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx";
import { ViewStudentCard } from "../../components/Cards/ViewStudentCard.tsx";
import { Header } from "../../components/Header.tsx";

export const ManageUsers = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
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
        useViewAllUsers(setUserArray, setError);
    }, [setUserArray, setError]);
    
    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            setSearchQuery("");
            setError("");
            await useViewAllUsers(setUserArray, setError);
            setIsOnSearch(false);
            return;
        }
        
        const searchedUsers = await useSearchUsers(searchQuery.trim(), setError);
        const filteredUsers = searchedUsers.filter((user: User) => user.role === "user");
        setUserArray(filteredUsers);
        setIsOnSearch(true);
    };
    
    const handleClearSearch = async () => {
        setSearchQuery("");
        setIsOnSearch(false);
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(false);
        setError("");
        await useViewAllUsers(setUserArray, setError);
    }
    
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
        await useViewAllUsers(setUserArray, setError);
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
        await useViewAllUsers(setUserArray, setError);           
    }
    
    return (
        <>
            <Header title="Manage Students" />
            <div className="inset-0 min-h-screen bg-slate-100">
                <div className="px-5 py-4">
                    <SearchBar handleSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isOnSearch={isOnSearch} handleClearSearch={handleClearSearch} />
                </div>
                <p>{error}</p>
                <div className="grid grid-cols-[0.3fr_repeat(5,1fr)] border-b border-gray-300 bg-gray-400 px-5 py-3 text-sm font-semibold text-white">
                    <div>#</div>
                    <div>Name</div>
                    <div>Strand</div>
                    <div>Section</div>
                    <div>Student ID</div>
                    <div className="ml-8">Actions</div>
                </div>
                
                {userArray.length > 0 ? (
                    userArray.map((user: Partial<User>, index) => (
                        <UserListCell
                            key={user.id}
                            user={user}
                            number={index + 1}
                            onDelete={() => loadDeleteCard(user)}
                            onLoadView={() => loadViewCard(user)}
                        />
                    ))
                ) : (
                    <p className="p-5 text-gray-500">
                        No users found.
                    </p>
                )}
                
                {showUpdateCard && selectedUser && <UpdateUserCard userId={selectedUser.id!} userName={selectedUser.username!} onUpdated={(updatedUser) => {updateNotification(updatedUser);}} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowUpdateCard(false)} />}            
                {showDeleteCard && selectedUser && <DeleteUserCard userId={selectedUser.id!} onDeleted={refreshUserList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowDeleteCard(false)} />}
                {showViewCard && selectedUser && <ViewStudentCard student={selectedUser} onUpdate={() => loadUpdateCard(selectedUser)} onClose={() => {setShowViewCard(false), setShowUpdateCard(false), setShowNotification(false)}} />}
                {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
            </div>
        </>
    );
}