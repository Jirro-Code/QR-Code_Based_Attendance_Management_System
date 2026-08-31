import { useRef, useState } from "react";
import { Header } from "../../../components/Header.tsx";
import { Input } from "../../../components/Input/Input.tsx";
import { SelectionField } from "../../../components/Input/SelectionField.tsx";
import { type StudentRegisterPayload } from "../../../services/auth.ts";
import { useCreate } from "../../../hooks/useCreate.ts";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";
import { ImageCropModal } from "../../../components/ImageCrop.tsx";
import { X } from "lucide-react";

export const RegisterStudent = () => {
    window.scrollTo({ top: 0, left: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    const [studentData, setStudentData] = useState<StudentRegisterPayload>({
        role: "user",
        profilePicture: null,
        username: "",
        email: "",
        password: "",
        studentId: "",
        studentLRN: "",
        studentStrand: "",
        studentSection: ""
    });
    const {useRegister} = useCreate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setConfirmPassword(e.target.name === "confirmPassword" ? e.target.value : confirmPassword);
        setStudentData((current) => ({...current, [e.target.name]: e.target.value}));
    }
    
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = "";
        if (file) {
            setPendingFile(file);
        }
    };
    
    const handleCropConfirm = (croppedFile: File) => {
        setStudentData((current) => ({ ...current, profilePicture: croppedFile }));
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(croppedFile);
        });
        setPendingFile(null);
    };
    
    const handleRemovePicture = () => {
        setStudentData((current) => ({ ...current, profilePicture: null }));
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
    };
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            if(studentData.username.trim().length < 2) {
                setError("Student name must be at least 2 characters long!");
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
            }
            if (!studentData.email.includes("@") || !studentData.email.includes(".")) {
                setError("Invalid email format!");
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
            }
            if (studentData.password.length < 6) {
                setError("Password must be at least 6 characters long!");
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
            }
            if (studentData.password !== confirmPassword) {
                setError("Passwords do not match!");
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
            }
            if (/^\d{4}-\d{4}-ICP$/.test(studentData.studentId) === false) {
                setError("Invalid Student ID format!");
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
            }
            if (studentData.studentLRN.length !== 12) {
                setError("Student LRN must be exactly 12 digits long!");
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
            }
            await useRegister({ form: studentData, setError, setShowNotification, setNotificationMessage});
        }
        catch (error) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            console.error("Error registering student:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred.");
        
        }
        finally {
            setIsSubmitting(false);
        }
    };
    
    const reloadPage = () => {
        setStudentData({
            role: "user",
            profilePicture: null,
            username: "",
            email: "",
            password: "",
            studentId: "",
            studentLRN: "",
            studentStrand: "",
            studentSection: ""
        });
        setError("");
        setConfirmPassword("");
        setShowNotification(false);
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
    }
    
    return (
        <>
            <Header title="Register Student" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-md mx-auto pt-10 p-6">
                    
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-3">
                        
                        <h2 className="text-lg font-semibold text-gray-700">Register an Icon</h2>
                        <p className="text-red-600 text-sm">{error}</p>
                        
                        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                            
                            <div className="flex flex-col mb-4">
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    htmlFor="profilePicture"
                                >
                                    Profile Picture:
                                </label>
                                
                                {previewUrl ? (
                                    <div className="mt-2 flex items-center gap-3">
                                        <img src={previewUrl} alt="Selected profile" className="w-16 h-16 rounded-md object-cover ring-1 ring-gray-200" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-gray-700 truncate max-w-45">{studentData.profilePicture?.name}</span>
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
                            
                            <Input label="Student Name" id="studentName" type="text" placeholder="Student Name" onChange={handleChange} name="username" value={studentData.username} error={error?.includes("name") ? error : undefined} />
                            <Input label="Email" id="studentEmail" type="email" placeholder="Email" onChange={handleChange} name="email" value={studentData.email} error={error?.includes("email") ? error : undefined} />
                            <Input label="Password" id="studentPassword" type="password" placeholder="Password" onChange={handleChange} name="password" value={studentData.password} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined} />
                            <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} name="confirmPassword" value={confirmPassword} error={error?.includes("Passwords") || error?.includes("Password") ? error : undefined} />
                            <Input label="Student LRN" id="studentLRN" type="number" placeholder="Student LRN" onChange={handleChange} name="studentLRN" value={studentData.studentLRN} error={error?.includes("LRN") || error?.includes("studentLRN") ? error : undefined} />
                            <Input label="Student ID" id="studentID" type="text" placeholder="2025-0000-ICP" onChange={handleChange} name="studentId" value={studentData.studentId} error={error?.includes("studentId") || error?.includes("Student ID") ? error : undefined} />
                            <SelectionField label="Student Strand" id="studentStrand" value={studentData.studentStrand} onChange={handleChange} isRequired={true}
                                placeholder="Select strand"
                                options={["ICT", "HRCTO", "GAS", "HUMSS", "ABM", "STEM", "AAD"]}
                            />
                            <Input label="Section" id="studentSection" type="text" placeholder="Section" onChange={handleChange} name="studentSection" value={studentData.studentSection} />
                            <button type="submit" disabled={isSubmitting} className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mt-2">
                                {isSubmitting ? 'Registering...' : 'Register Student'}
                            </button>
                        </form>
                    </div>
                    
                    {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => reloadPage()} />}
                    
                    {pendingFile && (
                        <ImageCropModal
                            file={pendingFile}
                            onConfirm={handleCropConfirm}
                            onClose={() => setPendingFile(null)}
                        />
                    )}
                    
                </div>
            </div>
        </>
    );
}
