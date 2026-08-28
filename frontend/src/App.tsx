import { Route, Routes } from "react-router-dom";
import { AdminLoginPage } from "./pages/admin/AdminLogin.tsx";
import { StudentLoginPage } from "./pages/student/StudentLogin.tsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.tsx";
import { StudentDashboard } from "./pages/student/Dashboard.tsx";
import { RegisterStudent } from "./pages/admin/create/RegisterStudent.tsx";
import { RegisterAdmin } from "./pages/admin/create/RegisterAdmin.tsx";
import { ManageStudents } from "./pages/admin/management/ManageStudents.tsx";
import { ManageEvents } from "./pages/admin/management/ManageEvents.tsx";
import { CreateEvent } from "./pages/admin/create/CreateEvent.tsx";
import { ScannerPage } from "./pages/admin/ScannerPage.tsx";
import { ManageAttendances } from "./pages/admin/management/ManageAttendances.tsx";
import { ArchivedStudents } from "./pages/admin/archive/ArchivedStudents.tsx";
import { ArchivedEvents } from "./pages/admin/archive/ArchivedEvents.tsx";

export const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/student-login" element={<StudentLoginPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/create-student" element={<RegisterStudent />} />
                <Route path="/create-admin" element={<RegisterAdmin />} />
                <Route path="/manage-students" element={<ManageStudents />} />
                <Route path="/manage-events" element={<ManageEvents />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/manage-attendances" element={<ManageAttendances />} />
                <Route path="/archived-students" element={<ArchivedStudents />} />
                <Route path="/archived-events" element={<ArchivedEvents />} />
            </Routes>
        </div>
    );
}
