import { Route, Routes } from "react-router-dom";
import { AdminLoginPage } from "./pages/admin/AdminLogin.tsx";
import { StudentLoginPage } from "./pages/student/StudentLogin.tsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.tsx";
import { StudentDashboard } from "./pages/student/StudentDashboard.tsx";
import { RegisterStudent } from "./pages/admin/create/RegisterStudent.tsx";
import { RegisterAdmin } from "./pages/admin/create/RegisterAdmin.tsx";
import { ManageStudents } from "./pages/admin/management/ManageStudents.tsx";
import { ManageEvents } from "./pages/admin/management/ManageEvents.tsx";
import { CreateEvent } from "./pages/admin/create/CreateEvent.tsx";
import { ScannerPage } from "./pages/admin/ScannerPage.tsx";
import { ManageAttendances } from "./pages/admin/management/ManageAttendances.tsx";
import { ArchivedStudents } from "./pages/admin/archive/ArchivedStudents.tsx";
import { ArchivedEvents } from "./pages/admin/archive/ArchivedEvents.tsx";
import { ArchivedAttendances } from "./pages/admin/archive/ArchivedAttendances.tsx";
import { AttendanceHistoryPage } from "./pages/student/AttendanceHistory.tsx";
import { EventsPage } from "./pages/student/EventsPage.tsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.tsx";
import { StudentProfilePage } from "./pages/student/StudentProfile.tsx";
import { AdminProfilePage } from "./pages/admin/AdminProfile.tsx";
import { AdminEditPage } from "./pages/admin/AdminEditPage.tsx";
import { StudentChangePasswordPage } from "./pages/student/StudentChangePasswordPage.tsx";
import { CookieConsent } from "./components/CookieConsent.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

export const App = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/student-login" element={<StudentLoginPage />} />
                <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin-profile" element={<ProtectedRoute allowedRole="admin"><AdminProfilePage /></ProtectedRoute>} />
                <Route path="/admin-edit" element={<ProtectedRoute allowedRole="admin"><AdminEditPage /></ProtectedRoute>} />
                <Route path="/create-student" element={<ProtectedRoute allowedRole="admin"><RegisterStudent /></ProtectedRoute>} />
                <Route path="/create-admin" element={<ProtectedRoute allowedRole="admin"><RegisterAdmin /></ProtectedRoute>} />
                <Route path="/manage-students" element={<ProtectedRoute allowedRole="admin"><ManageStudents /></ProtectedRoute>} />
                <Route path="/manage-events" element={<ProtectedRoute allowedRole="admin"><ManageEvents /></ProtectedRoute>} />
                <Route path="/create-event" element={<ProtectedRoute allowedRole="admin"><CreateEvent /></ProtectedRoute>} />
                <Route path="/scanner" element={<ProtectedRoute allowedRole="admin"><ScannerPage /></ProtectedRoute>} />
                <Route path="/manage-attendances" element={<ProtectedRoute allowedRole="admin"><ManageAttendances /></ProtectedRoute>} />
                <Route path="/archived-students" element={<ProtectedRoute allowedRole="admin"><ArchivedStudents /></ProtectedRoute>} />
                <Route path="/archived-events" element={<ProtectedRoute allowedRole="admin"><ArchivedEvents /></ProtectedRoute>} />
                <Route path="/archived-attendances" element={<ProtectedRoute allowedRole="admin"><ArchivedAttendances /></ProtectedRoute>} />
                <Route path="/student-dashboard" element={<ProtectedRoute allowedRole="user"><StudentDashboard /></ProtectedRoute>} />
                <Route path="/student-profile" element={<ProtectedRoute allowedRole="user"><StudentProfilePage /></ProtectedRoute>} />
                <Route path="/student-change-password" element={<ProtectedRoute allowedRole="user"><StudentChangePasswordPage /></ProtectedRoute>} />
                <Route path="/attendance-history" element={<ProtectedRoute allowedRole="user"><AttendanceHistoryPage /></ProtectedRoute>} />
                <Route path="/events-page" element={<ProtectedRoute allowedRole="user"><EventsPage /></ProtectedRoute>} />
                <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
            </Routes>
            <CookieConsent />
        </div>
    );
}
