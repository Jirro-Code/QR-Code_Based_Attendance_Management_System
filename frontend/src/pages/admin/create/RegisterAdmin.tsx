import { useRef, useState } from "react";
import { Header } from "../../../components/Header.tsx";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";
import { Input } from "../../../components/Input/Input.tsx";
import { useCreate } from "../../../hooks/useCreate.ts";
import { type AdminRegisterPayload } from "../../../services/auth.ts";
import { ImageCropModal } from "../../../components/ImageCrop.tsx";
import { X } from "lucide-react";

export const RegisterAdmin = () => {  
    window.scrollTo({ top: 0, left: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string; result?: { [key: string]: any } }>({
        title: "",
        message: "",
    });
    const [adminData, setAdminData] = useState<AdminRegisterPayload>({
        role: "admin",
        profilePicture: null,
        username: "",
        email: "",
        password: ""
    });
    const {useRegister} = useCreate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.name === "confirmPassword" ? e.target.value : confirmPassword);
        setAdminData({...adminData, [e.target.name]: e.target.value});
    }
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = "";
        if (file) {
            setPendingFile(file);
        }
    };
    
    const handleCropConfirm = (croppedFile: File) => {
        setAdminData((current) => ({ ...current, profilePicture: croppedFile }));
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(croppedFile);
        });
        setPendingFile(null);
    };
    
    const handleRemovePicture = () => {
        setAdminData((current) => ({ ...current, profilePicture: null }));
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
    };
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            if(adminData.username.trim().length < 2) {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                setError("Admin name must be at least 2 characters long!");
                return;
            }
            if (!adminData.email.includes("@") || !adminData.email.includes(".")) {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                setError("Invalid email format!");
                return;
            }
            if(adminData.password.trim().length < 6) {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                setError("Password must be at least 6 characters long!");
                return;
            }
            if (adminData.password !== confirmPassword) {
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                setError("Passwords do not match!");
                return;
            }
            await useRegister({form: adminData, setError, setShowNotification, setNotificationMessage});
        } 
        catch (error) {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            console.error("Error registering admin:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
        finally {
            setIsSubmitting(false);
            if (notificationMessage.title === "Registration Successful") {
                setAdminData({
                    role: "admin",
                    profilePicture: null,
                    username: "",
                    email: "",
                    password: ""
                });
                setConfirmPassword("");
                setPreviewUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                });
                setError("");
            }
        }
    };
    
    return (
        <>
            <Header title="Register Admin" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-full mx-auto pt-10 p-6 flex flex-col gap-3">
                    
                    <h2 className="text-lg font-semibold text-gray-700">Register an Admin</h2>
                    <p className="text-red-600 text-sm">{error}</p>
                    
                    <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                        <div className="flex flex-col mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="profilePicture">
                                Profile Picture:
                            </label>
                            
                            {previewUrl ? (
                                <div className="mt-2 flex items-center gap-3">
                                    <img src={previewUrl} alt="Selected profile" className="w-16 h-16 rounded-md object-cover ring-1 ring-gray-200" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm text-gray-700 truncate max-w-45">{adminData.profilePicture?.name}</span>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-800 hover:underline cursor-pointer">
                                                Change
                                            </button>
                                            <button type="button" onClick={handleRemovePicture} className="text-xs text-red-600 hover:underline flex items-center gap-0.5">
                                                <X size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <input
                                    ref={fileInputRef}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                    id="profilePicture"
                                    type="file"
                                    name="profilePicture"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleFileSelected}
                                    required
                                />
                            )}
                            
                            {previewUrl && (
                                <input
                                    ref={fileInputRef}
                                    className="hidden"
                                    type="file"
                                    name="profilePicture"
                                    accept="image/png,image/jpeg,image/webp"
                                    onChange={handleFileSelected}
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                            <Input label="Admin Name" id="adminName" type="text" placeholder="Admin Name" onChange={handleChange} name="username" value={adminData.username} error={error?.includes("name") ? error : undefined} />
                            <Input label="Email" id="adminEmail" type="email" placeholder="Email" onChange={handleChange} name="email" value={adminData.email} error={error?.includes("email") ? error : undefined}/>
                            <Input label="Password" id="adminPassword" type="password" placeholder="Password" onChange={handleChange} name="password" value={adminData.password} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined}/>
                            <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} name="confirmPassword" value={confirmPassword} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined} />
                        </div>
                        <button  type="submit" disabled={isSubmitting} className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mt-4 w-full sm:w-auto sm:min-w-40 self-center sm:self-end" >
                            {isSubmitting ? 'Registering...' : 'Register Admin'}
                        </button>
                    </form>
                </div>
            </div>
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
            {pendingFile && <ImageCropModal file={pendingFile} onConfirm={handleCropConfirm} onClose={() => setPendingFile(null)} />}
        </>
    );
}