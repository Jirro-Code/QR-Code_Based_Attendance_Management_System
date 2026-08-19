import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage.tsx";
import { AdminLoginPage } from "./pages/admin/AdminLogin.tsx";
import { StudentLoginPage } from "./pages/student/StudentLogin.tsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.tsx";
import { StudentDashboard } from "./pages/student/Dashboard.tsx";
import { RegisterStudent } from "./pages/admin/register/RegisterStudent.tsx";
import { RegisterAdmin } from "./pages/admin/register/RegisterAdmin.tsx";
import { ManageUsers } from "./pages/admin/ManageStudents.tsx";
import { ManageEvents } from "./pages/admin/ManageEvents.tsx";
import { CreateEvent } from "./pages/admin/CreateEvent.tsx";
import { ScannerPage } from "./pages/admin/ScannerPage.tsx";
import { ManageAttendances } from "./pages/admin/ManageAttendances.tsx";

export const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/student-login" element={<StudentLoginPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/create-student" element={<RegisterStudent />} />
                <Route path="/create-admin" element={<RegisterAdmin />} />
                <Route path="/manage-students" element={<ManageUsers />} />
                <Route path="/manage-events" element={<ManageEvents />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/manage-attendances" element={<ManageAttendances />} />
            </Routes>
        </div>
    );
}
