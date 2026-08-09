import { Route, Routes } from "react-router-dom";
import { SelectionPage } from "./pages/logs/LoginPage/LoginPage.tsx";
import { AdminLoginPage } from "./pages/logs/AdminLogin/AdminLoginPage.tsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.tsx";
import { RegisterStudent } from "./pages/admin/register/RegisterStudent.tsx";
import { RegisterAdmin } from "./pages/admin/register/RegisterAdmin.tsx";
import { ManageUsers } from "./pages/admin/ManageStudents.tsx";
import { ManageEvents } from "./pages/admin/ManageEvents/ManageEvents.tsx";
import { CreateEvent } from "./pages/admin/CreateEvent.tsx";

export const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<SelectionPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/create-student" element={<RegisterStudent />} />
                <Route path="/create-admin" element={<RegisterAdmin />} />
                <Route path="/manage-students" element={<ManageUsers />} />
                <Route path="/manage-events" element={<ManageEvents />} />
                <Route path="/create-event" element={<CreateEvent />} />
            </Routes>
        </div>
    );
}
