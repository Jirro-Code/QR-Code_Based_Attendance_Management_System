import { useView } from "../../../hooks/useView.ts";
import { type User } from "../../../services/users.ts";
import { useEffect, useState } from "react";
import { SearchBar } from "../../../components/SearchBar.tsx";
import { UserListCell } from "../../../components/ListCells/UserListCell.tsx";
import { UpdateUserCard } from "../../../components/Cards/UpdateCards/UpdateUserCard.tsx";
import { UnarchiveUserCard } from "../../../components/Cards/UnarchiveCards/UnarchiveUserCard.tsx";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";
import { ViewStudentCard } from "../../../components/Cards/ViewCards/ViewStudentCard.tsx";
import { Header } from "../../../components/Header.tsx";
import { StudentFilterOptions } from "../../../components/Filters/StudentFilter.tsx";
import { Ellipsis } from "lucide-react";

export const ArchivedStudents = () => {
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
    const [showUnarchiveCard, setShowUnarchiveCard] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [showViewCard, setShowViewCard] = useState<boolean>(false);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    
    const [selectedOrder, setSelectedOrder] = useState<"A-Z" | "Z-A" | null>(null);
    const [selectedStrand, setSelectedStrand] = useState<string | null>(null);
    const [selectedBySection, setSelectedBySection] = useState<string | null>(null);
    
    useEffect(() => {
        useViewAllUsers(setUserArray, setError);
    }, [setUserArray, setError]);
    
    const applyAllFilters = async (
        order: "A-Z" | "Z-A" | null,
        strand: string | null,
        bySection: string | null,
        query: string
    ) => {
        await useViewAllUsers(async (allUsers: User[]) => {
            setError("");
            
            let result = [...allUsers];
            
            if (strand) {
                result = result.filter((user) => user.studentStrand === strand);
            }
            
            if (bySection) {
                result = result.filter((user) =>
                    user.studentSection?.toLowerCase().includes(bySection.toLowerCase())
                );
            }
            
            if (query.trim() !== "") {
                const searchedStudents = await useSearchUsers(query.trim(), setError);
                const searchedIds = new Set(
                    searchedStudents.filter((s) => s.role === "user").map((s) => s.id)
                );
                result = result.filter((student) => searchedIds.has(student.id));
            }
            
            if (order) {
                result.sort((a, b) =>
                    order === "A-Z"
                        ? a.username.localeCompare(b.username)
                        : b.username.localeCompare(a.username)
                );
            }
            setUserArray(result);
        }, setError);
    }
    
    const handleApplyFilters = async (
        sortAlphabetical: "A-Z" | "Z-A" | null,
        strand: string | null,
        bySection: string | null
    ) => {
        setSelectedOrder(sortAlphabetical);
        setSelectedStrand(strand);
        setSelectedBySection(bySection);
        
        await applyAllFilters(sortAlphabetical, strand, bySection, isOnSearch ? searchQuery : "");
    };
    
    
    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            setIsOnSearch(false);
            setSearchQuery("");
            await applyAllFilters(selectedOrder, selectedStrand, selectedBySection, "");
            return;
        }
        
        setIsOnSearch(true);
        await applyAllFilters(selectedOrder, selectedStrand, selectedBySection, searchQuery);
    };
    
    const handleClearSearch = async () => {
        setSearchQuery("");
        setIsOnSearch(false);
        setShowUpdateCard(false);
        setShowUnarchiveCard(false);
        setShowViewCard(false);
        setError("");
        await applyAllFilters(selectedOrder, selectedStrand, selectedBySection, "");
    }
    
    const refreshUserList = async () => {
        setShowUpdateCard(false);
        setShowUnarchiveCard(false);
        setShowViewCard(false);
        setError("");
        await applyAllFilters(selectedOrder, selectedStrand, selectedBySection, isOnSearch ? searchQuery : "");
    }
    
    const loadViewCard = (user: Partial<User>) => {
        setSelectedUser(user);
        setShowViewCard(true);
        setShowUpdateCard(false);
        setShowUnarchiveCard(false);
        setShowNotification(false);
    };
    
    const loadUnarchiveCard = (user: Partial<User>) => {
        setSelectedUser(user);
        setShowUnarchiveCard(true);
        setShowUpdateCard(false);
        setShowViewCard(false);
        setShowNotification(false);
    };
    
    const loadUpdateCard = (user: Partial<User>) => {
        setSelectedUser(user);
        setShowUpdateCard(true);
        setShowUnarchiveCard(false);
        setShowNotification(false);
    }
    
    const updateNotification = async (updatedUser: Partial<User>) => {
        setSelectedUser(updatedUser);
        setUserArray((prevUsers) => prevUsers.map((user) => user.id === updatedUser.id ? updatedUser : user));
        setShowUpdateCard(false);
        setShowUnarchiveCard(false);
        setShowViewCard(true);
        setShowNotification(true);
        await applyAllFilters(selectedOrder, selectedStrand, selectedBySection, isOnSearch ? searchQuery : "");
    }
    
    return (
        <>
            <Header title={ "Archived Students"} path="/manage-students" />
            <div className="inset-0 min-h-screen bg-slate-100">
                <div className="px-5 py-4">
                    <SearchBar handleSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isOnSearch={isOnSearch} handleClearSearch={handleClearSearch} handleFilterClick={() => setShowFilter(true)} />
                    <p>{error}</p>
                    
                    {!isOnSearch &&
                        <div className="mt-3 flex items-center justify-end">
                            <button onClick={() => setShowFilter(true)}>
                                <Ellipsis className="w-5 h-5" />
                            </button>
                        </div>
                    }
                </div>
                
                
                <div className="grid grid-cols-[0.3fr_repeat(5,1fr)] border-b border-gray-300 bg-gray-400 px-5 py-3 text-sm font-semibold text-white">
                    <div>#</div>
                    <div>Name</div>
                    <div>Strand</div>
                    <div>Section</div>
                    <div>Student ID</div>
                    <div className="ml-8">Actions</div>
                </div>
                
                {userArray.filter((user) => user.isArchived === true).length > 0 ? (
                    userArray.filter((user) => user.isArchived === true).map((user: Partial<User>, index) => (
                        <UserListCell
                            key={user.id}
                            user={user}
                            number={index + 1}
                            onRestore={() => loadUnarchiveCard(user)}
                            onLoadView={() => loadViewCard(user)}
                        />
                    ))
                ) : (
                    <p className="p-5 text-gray-500">
                        No users found.
                    </p>
                )}
                {showFilter && (<StudentFilterOptions onApplyFilters={handleApplyFilters} onClose={() => setShowFilter(false)} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} selectedStrand={selectedStrand} setSelectedStrand={setSelectedStrand} selectedBySection={selectedBySection} setSelectedBySection={setSelectedBySection} /> )}
                {showUpdateCard && selectedUser && <UpdateUserCard userId={selectedUser.id!} userName={selectedUser.username!} onUpdated={(updatedUser) => {updateNotification(updatedUser);}} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowUpdateCard(false)} />}
                {showUnarchiveCard && selectedUser && <UnarchiveUserCard userId={selectedUser.id!} username={selectedUser.username!} onRestored={refreshUserList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowUnarchiveCard(false)}  />}
                {showViewCard && selectedUser && <ViewStudentCard student={selectedUser} onUpdate={() => loadUpdateCard(selectedUser)} onClose={() => {setShowViewCard(false), setShowUpdateCard(false), setShowNotification(false)}} />}
                {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
            </div>
        </>
    );
}
