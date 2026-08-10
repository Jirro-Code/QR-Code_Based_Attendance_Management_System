import { useCurrentUser } from "../../hooks/useCurrentUser";
import {useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";
import { type User } from "../../services/users";
import { SelectionCard } from "../../components/Cards/SelectionCards.tsx";

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [adminData, setAdminData] = useState<Partial<User>>({
        id: "",
        username: "",
        email: "",
        role: "admin",
    });
    
    useCurrentUser("/admin-login", setAdminData);
    
    const isSelectingHandler = () => {
        setIsSelecting(false);
    }
    
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {adminData.username}!</p>
            <button onClick={() => navigate("/manage-students")}>Manage Students</button>
            <button onClick={() => setIsSelecting(true)}>Create Account</button>
            <button onClick={() => navigate("/manage-events")}>Manage Events</button>
            <button onClick={() => navigate("/create-event")}>New Event</button>
            <button onClick={() => logout("/admin-login")}>Logout</button>
        
            {isSelecting && <SelectionCard onClose={() => isSelectingHandler()} />}
        </div>
    );
}