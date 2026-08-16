import { useState } from "react";
import { Header } from "../../../components/Header.tsx";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";
import { Input } from "../../../components/Input/Input.tsx";
import { useCreate } from "../../../hooks/useCreate.ts";
import { useScrollToTop } from "../../../hooks/useScrollToTop.ts";
import { type AdminRegisterPayload } from "../../../services/auth.ts";

export const RegisterAdmin = () => {  
    const { useScrollToTopPage } = useScrollToTop();
    useScrollToTopPage("/register-admin");
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
        <>
            <Header title="Register Admin" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-md mx-auto pt-10 p-6">
                    <h1 className="text-2xl font-bold text-gray-800">Register Admin</h1>
                    <p className="text-gray-600 mb-4">Welcome to the admin registration page!</p>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-gray-700">Register a New Admin</h2>
                        <p className="text-red-600 text-sm">{error}</p>
                        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                            <Input label="Admin Name" id="adminName" type="text" placeholder="Admin Name" onChange={handleChange} name="username" value={adminData.username} />
                            <Input label="Email" id="adminEmail" type="email" placeholder="Email" onChange={handleChange} name="email" value={adminData.email} />
                            <Input label="Password" id="adminPassword" type="password" placeholder="Password" onChange={handleChange} name="password" value={adminData.password} />
                            <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} name="confirmPassword" value={confirmPassword} />
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2">Register Admin</button>
                        </form>
                    </div>
                    
                    {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => reloadPage()} />}
                </div>
            </div>
        </>
    );
}