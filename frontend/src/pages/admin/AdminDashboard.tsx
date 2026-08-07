import useCurrentUser from "../../hooks/useCurrentUser";
import {useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";
import { type UserData } from "../../services/users";

function AdminDashboard() {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState<UserData>({
        id: "",
        username: "",
        email: "",
        role: "admin",
    });
    
    useCurrentUser("/admin-login", setAdminData);
    
    
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {adminData.username}!</p>
            <button onClick={() => navigate("/manage-students")}>Manage Students</button>
            <button onClick={() => navigate("/create-user")}>Create User</button>
            <button>View Reports</button>
            <button onClick={() => logout("/admin-login")}>Logout</button>
        </div>
    );
}

export default AdminDashboard;