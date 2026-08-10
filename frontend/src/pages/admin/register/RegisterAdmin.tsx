import { useState } from "react";
import { BackButton } from "../../../components/Button/Button.tsx";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";
import { Input } from "../../../components/Input/Input.tsx";
import { useCreate } from "../../../hooks/useCreate.ts";
import { type AdminRegisterPayload } from "../../../services/auth.ts";

export const RegisterAdmin = () => {  
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string; result?: { [key: string]: any } }>({
        title: "",
        message: "",
    });
    const [adminData, setAdminData] = useState<AdminRegisterPayload>({
        role: "admin",
        username: "",
        email: "",
        password: ""
    });
    const {useRegister} = useCreate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.name === "confirmPassword" ? e.target.value : confirmPassword);
        setAdminData({...adminData, [e.target.name]: e.target.value});
    }
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (adminData.password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        await useRegister({form: adminData, setError, setShowNotification, setNotificationMessage});
    }
    
    const reloadPage = () => {
        setAdminData({
            role: "admin",
            username: "",
            email: "",
            password: ""
        });
        setConfirmPassword("");
        setShowNotification(false);
    }
    
    return (
        <div className="registerAdminPage">
            <h1>Register Admin</h1>
            <p>Welcome to the admin registration page!</p>
            <div className="backButton"><BackButton path="/admin-dashboard" /></div>
            
            <div className="registerAdminForm">
                <h2>Register a New Admin</h2>
                <p>{error}</p>
                <form onSubmit={handleSubmit}>
                    <Input label="Admin Name" id="adminName" type="text" placeholder="Admin Name" onChange={handleChange} name="username" value={adminData.username} />
                    <Input label="Email" id="adminEmail" type="email" placeholder="Email" onChange={handleChange} name="email" value={adminData.email} />
                    <Input label="Password" id="adminPassword" type="password" placeholder="Password" onChange={handleChange} name="password" value={adminData.password} />
                    <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} name="confirmPassword" value={confirmPassword} />
                    <button type="submit">Register Admin</button>
                </form>
            </div>
            
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => reloadPage()} />}
        </div>
    );
}