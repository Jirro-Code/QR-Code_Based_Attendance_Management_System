import useCurrentUser from "../../hooks/useCurrentUser";
import {useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";
import { type UserData } from "../../services/users";
import SelectionCard from "../../components/cards/SelectionCards.tsx";

function AdminDashboard() {
    const navigate = useNavigate();
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [adminData, setAdminData] = useState<UserData>({
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
            <button onClick={() => navigate("/manage-events")}>Events</button>
            <button onClick={() => logout("/admin-login")}>Logout</button>
        
            {isSelecting && <SelectionCard onClose={() => isSelectingHandler()} />}
        </div>
    );
}

export default AdminDashboard;