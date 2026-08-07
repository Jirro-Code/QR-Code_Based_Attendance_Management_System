import { Route, Routes } from "react-router-dom";
import SelectionPage from "./pages/logs/LoginPage.tsx";
import AdminLoginPage from "./pages/logs/AdminLoginPage.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import CreateUserPage from "./pages/admin/register/CreateUser.tsx";
import StudentRegister from "./pages/admin/register/RegisterStudent.tsx";
import AdminRegister from "./pages/admin/register/RegisterAdmin.tsx";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<SelectionPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/create-user" element={<CreateUserPage />} />
                <Route path="/create-student" element={<StudentRegister />} />
                <Route path="/create-admin" element={<AdminRegister />} />
            </Routes>
        </div>
    );
}

export default App
