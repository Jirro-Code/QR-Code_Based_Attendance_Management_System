import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin dashboard!</p>
            <button>Manage Students</button>
            <button onClick={() => navigate("/create-user")}>Create User</button>
            <button>View Reports</button>
            <button>Settings</button>
        </div>
    );
}

export default AdminDashboard;