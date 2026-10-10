import { useEffect, useRef, useState } from "react";
import { Header } from "../../../components/Header.tsx";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";
import { Input } from "../../../components/Input/Input.tsx";
import { useCreate } from "../../../hooks/useCreate.ts";
import { type AdminRegisterPayload } from "../../../services/auth.ts";
import { ImageCropModal } from "../../../components/ImageCrop.tsx";
import { Eye, EyeOff, X } from "lucide-react";

export const RegisterAdmin = () => {  
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const [isHidden2, setIsHidden2] = useState(true);
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
            setAdminData({
                role: "admin",
                profilePicture: null,
                username: "",
                email: "",
                password: ""
            });
            setConfirmPassword("");
            setError("");
            setPreviewUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
        } 
        catch (error) {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            console.error("Error registering admin:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <Header title="Register Admin" path="/admin-dashboard" />
            
            <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col pt-6 sm:pt-10 p-4 sm:p-6">
                <form className="relative mt-3 flex-1 flex flex-col gap-3 sm:gap-6" onSubmit={handleSubmit}>
                    
                    <div className="min-h-0 flex-1 flex flex-col gap-3 sm:gap-6 pb-16 sm:pb-24">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="profilePicture">
                                Profile Picture:
                            </label>
                            
                            {previewUrl ? (
                                <div className="mt-2 flex items-center gap-3 justify-center flex-col">
                                    <img src={previewUrl} alt="Selected profile" className="w-30 h-30 rounded-md object-cover ring-1 ring-gray-200" />
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
                        
                        <div className="w-full grid grid-cols-1 gap-x-8 gap-y-2">
                            <Input label="Admin Name" id="adminName" type="text" placeholder="Admin Name" onChange={handleChange} name="username" value={adminData.username} error={error?.includes("name") ? error : undefined} />
                            <Input label="Email" id="adminEmail" type="email" placeholder="Email" onChange={handleChange} name="email" value={adminData.email} error={error?.includes("email") ? error : undefined}/>
                            <div className="relative">
                                <Input label="Password" id="adminPassword" type={isHidden ? "password" : "text"} placeholder="Password" onChange={handleChange} name="password" value={adminData.password} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined}/>
                                <button type="button" onClick={() => setIsHidden(!isHidden)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-600 focus:outline-none">
                                    {isHidden ? <EyeOff size={"20"} /> : <Eye size={"20"} />}
                                </button>
                            </div>
                            <div className="relative">
                                <Input label="Confirm Password" id="confirmPassword" type={isHidden2 ? "password" : "text"} placeholder="Confirm Password" onChange={handleChange} name="confirmPassword" value={confirmPassword} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined} />
                                <button type="button" onClick={() => setIsHidden2(!isHidden2)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-600 focus:outline-none">
                                    {isHidden2 ? <EyeOff size={"20"} /> : <Eye size={"20"} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-6 sm:absolute sm:right-0 sm:bottom-6 sm:pt-0 sm:z-10">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-800 hover:bg-blue-900 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded w-full sm:w-auto sm:min-w-40 transition-colors duration-200"
                        >
                            {isSubmitting ? 'Registering...' : 'Register Admin'}
                        </button>
                    </div>
                    
                </form>
            </div>
            
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
            {pendingFile && <ImageCropModal file={pendingFile} onConfirm={handleCropConfirm} onClose={() => setPendingFile(null)} />}
        </div>
    );
}