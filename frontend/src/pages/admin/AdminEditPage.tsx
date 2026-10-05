import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, X } from "lucide-react";
import { Header } from "../../components/Header.tsx";
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx";
import { ImageCropModal } from "../../components/ImageCrop.tsx";
import { Input } from "../../components/Input/Input.tsx";
import { getProfilePictureById, getSelf, updateUser, type User } from "../../services/users.ts";

export const AdminEditPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [admin, setAdmin] = useState<Partial<User>>({ role: "admin" });
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState({ title: "", message: "" });
    const [hiddenFields, setHiddenFields] = useState({ current: true, password: true, confirm: true });
    
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
        const loadAdmin = async () => {
            try {
                const response = await getSelf();
                const user = response.user as User;
                setAdmin(user);
                setUsername(user.username);
                setEmail(user.email);
                if (user.profilePictureUrl) {
                    const pictureResponse = await getProfilePictureById(user.id);
                    setPreviewUrl(pictureResponse.url as string);
                }
            } catch (loadError) {
                console.error("Error loading admin profile:", loadError);
                setError(loadError instanceof Error ? loadError.message : "Unable to load your profile.");
            }
        };
        loadAdmin();
    }, []);
    
    useEffect(() => () => {
        if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);
    
    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        event.target.value = "";
        if (file) setPendingFile(file);
    };
    
    const handleCropConfirm = (file: File) => {
        setProfilePicture(file);
        setPreviewUrl((previous) => {
            if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
            return URL.createObjectURL(file);
        });
        setPendingFile(null);
    };
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        
        if (username.trim().length < 2) {
            setError("Admin name must be at least 2 characters long.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Invalid email format.");
            return;
        }
        if (password && !currentPassword) {
            setError("Enter your old password before changing your password.");
            return;
        }
        if (password && password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await updateUser(admin.id!, {
                username,
                email,
                profilePicture,
                ...(password ? { password, currentPassword } : {}),
            });
            setAdmin(response.user);
            setPassword("");
            setConfirmPassword("");
            setCurrentPassword("");
            setNotificationMessage({ title: "Profile Updated", message: "Your admin profile was updated successfully." });
            setShowNotification(true);
        } catch (submitError) {
            console.error("Error updating admin profile:", submitError);
            setError(submitError instanceof Error ? submitError.message : "Unable to update your profile.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const toggleField = (field: keyof typeof hiddenFields) => {
        setHiddenFields((fields) => ({ ...fields, [field]: !fields[field] }));
    };
    
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <Header title="Edit Admin Profile" path="/admin-profile" />
            <main className="w-full max-w-4xl mx-auto flex-1 p-4 sm:p-8">
                <form className="mt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
                    {error && <div className="text-red-700 px-2" role="alert">{error}</div>}
                    
                    <div>   
                        <label className="block text-sm font-medium text-gray-700" htmlFor="profilePicture">Profile Picture:</label>
                        {previewUrl ? (
                            <div className="mt-2 flex items-center gap-3">
                                <img src={previewUrl} alt="Selected profile" className="w-30 h-30 rounded-md object-cover ring-1 ring-gray-200" />
                                <div className="flex gap-3 text-xs">
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-blue-800 hover:underline">Change</button>
                                    <button type="button" onClick={() => { setProfilePicture(null); setPreviewUrl(null); }} className="text-red-600 hover:underline flex items-center gap-0.5"><X size={12} /> Remove</button>
                                </div>
                            </div>
                        ) : <p className="mt-2 text-sm text-gray-500">No profile picture selected.</p>}
                        <input ref={fileInputRef} className="hidden" type="file" id="profilePicture" accept="image/png,image/jpeg,image/webp" onChange={handleFileSelected} />
                    </div>
                    
                    <Input label="Admin Name" id="adminName" type="text" placeholder="Admin Name" name="username" value={username} onChange={(event) => setUsername(event.target.value)} error={error?.includes("name") ? error : undefined}/>
                    <Input label="Email" id="adminEmail" type="email" placeholder="Email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} error={error?.includes("email") ? error : undefined} />
                    <div className="relative">
                        <Input label="Old Password" id="currentPassword" type={hiddenFields.current ? "password" : "text"} placeholder="Old Password" name="currentPassword" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} isRequired={false} error={error?.includes("Current password") ? error : undefined} />
                        <button type="button" onClick={() => toggleField("current")} className="absolute right-3 top-9 text-gray-500">{hiddenFields.current ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                    <div className="relative">
                        <Input label="New Password" id="newPassword" type={hiddenFields.password ? "password" : "text"} placeholder="New Password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} isRequired={false} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined}/>
                        <button type="button" onClick={() => toggleField("password")} className="absolute right-3 top-9 text-gray-500">{hiddenFields.password ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                    <div className="relative">
                        <Input label="Confirm New Password" id="confirmPassword" type={hiddenFields.confirm ? "password" : "text"} placeholder="Confirm New Password" name="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} isRequired={false} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined}/>
                        <button type="button" onClick={() => toggleField("confirm")} className="absolute right-3 top-9 text-gray-500">{hiddenFields.confirm ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                    <p className="text-sm text-gray-500">Forgot your password? <button type="button" onClick={() => navigate("/forgot-password", { state: { isAdmin: true } })} className="text-blue-600 hover:underline">Click here</button></p>
                    
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => navigate("/admin-profile")} className="border border-gray-300 bg-white text-gray-700 font-semibold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" disabled={isSubmitting || !admin.id} className="bg-blue-800 hover:bg-blue-900 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">{isSubmitting ? "Saving..." : "Save Changes"}</button>
                    </div>
                </form>
            </main>
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
            {pendingFile && <ImageCropModal file={pendingFile} onConfirm={handleCropConfirm} onClose={() => setPendingFile(null)} />}
        </div>
    );
};
