import { useUpdate } from "../../../hooks/useUpdate.ts";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";
import { useRef, useState } from "react";
import { Input }  from "../../Input/Input.tsx";
import { type User } from "../../../services/users.ts";
import { SelectionField } from "../../Input/SelectionField.tsx";
import { CancelButton } from "../../Button.tsx";
import { ImageCropModal } from "../../../components/ImageCrop.tsx";
import { X } from "lucide-react";

type UpdateUserCardProps = {
    userId: string;
    userName: string;
    onUpdated: (updatedUser: User) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    onClose: () => void;
};

export const UpdateUserCard = ({ userId, userName, onUpdated, setShowNotification, onSetNotif, onClose }: UpdateUserCardProps) => {
    const { useUpdateUser } = useUpdate();
    const { useScrollToTopOverflow } = useScrollFunctions();
    const [formData, setFormData] = useState<User>({} as User);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const updateCardRef = useRef<HTMLDivElement>(null);
    const hasContent = Object.values(formData).some((value) => String(value ?? "").trim() !== "") || confirmPassword.trim() !== "";
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({...current, [e.target.name]: e.target.value}));
        if (e.target.name === "confirmPassword") {
            setConfirmPassword(e.target.value);
        }
    }
    
    
    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = "";
        if (file) {
            setPendingFile(file);
        }
    };
    
    const handleCropConfirm = (croppedFile: File) => {
        setFormData((current) => ({ ...current, profilePicture: croppedFile }));
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(croppedFile);
        });
        setPendingFile(null);
    };
    
    const handleRemovePicture = () => {
        setFormData((current) => ({ ...current, profilePicture: null }));
        setPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
    };
    
    const handleUpdate = async (data: User) => {
        setIsSubmitting(true);
        try {
            if (data.username && data.username.trim().length < 2) {
                useScrollToTopOverflow(updateCardRef);
                setError("Student name must be at least 2 characters long.");
                return;
            }
            
            if (data.email && (!data.email.includes("@") || !data.email.includes("."))) {
                useScrollToTopOverflow(updateCardRef);
                setError("Invalid email format.");
                return;
            }
            
            if(confirmPassword && data.password === undefined) {
                useScrollToTopOverflow(updateCardRef);
                setError("Ensure that the password is filled out.");
                return;
            }
            
            if (data.password !== undefined){
                if(data.password && data.password.length < 6) {
                    useScrollToTopOverflow(updateCardRef);
                    setError("Password must be at least 6 characters long.");
                    return;
                }
                if (data.password !== confirmPassword) {
                    useScrollToTopOverflow(updateCardRef);
                    setError("Passwords do not match!");
                    return;
                }
            }
            
            if (data.studentId && /^\d{4}-\d{4}-ICP$/.test(data.studentId) === false) {
                useScrollToTopOverflow(updateCardRef);
                setError("Invalid Student ID format.");
                return;
            }
            
            if (data.studentLRN && data.studentLRN.length !== 12) {
                useScrollToTopOverflow(updateCardRef);
                setError("Student LRN must be exactly 12 digits long.");
                return;
            }
            
            setError("");
            const filteredData = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
            ) as User;
            
            const updatedUser = await useUpdateUser({ ...filteredData, id: userId }, setError);
            
            onUpdated(updatedUser);
            setFormData({} as User);
            setConfirmPassword("");
            onSetNotif({
                title: "Update Successful",
                message: "Data updated successfully!"
            });
            setShowNotification(true);
        } 
        catch (error) {
            useScrollToTopOverflow(updateCardRef);
            console.error("Error updating data:", error);
            onSetNotif({ title: "Update Failed",message: "Failed to update data." });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    
    
    return (
        <div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50 p-4">
            <div className="bg-blue-800 p-6 rounded-tl-lg shadow-md items-center flex justify-between max-w-md w-full h-20 relative">
                <h1 className="text-white text-2xl font-bold">{userName}</h1>
                <CancelButton onClose={onClose} />
            </div>
            <div ref={updateCardRef} id="update-user-card" className="scrollable-card bg-white rounded-bl-lg shadow-lg p-6 relative flex flex-col gap-3 max-w-md w-full max-h-[80vh] overflow-y-auto overscroll-contain">
                <p className="text-red-600 text-sm">{error}</p>
                
                <form className="flex flex-col gap-1">
                    
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
                                    <span className="text-sm text-gray-700 truncate max-w-45">{formData.profilePicture?.name}</span>
                                    <div className="flex gap-3">
                                        <label htmlFor="profilePicture" className="text-xs text-blue-800 hover:underline cursor-pointer">
                                            Change
                                        </label>
                                        <button type="button" onClick={handleRemovePicture} className="text-xs text-red-600 hover:underline flex items-center gap-0.5">
                                            <X size={12} /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <input
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
                                className="hidden"
                                id="profilePicture"
                                type="file"
                                name="profilePicture"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleFileSelected}
                                required
                            />
                        )}
                    </div>
                    
                    <Input label="Student Name" id="studentName" type="text" placeholder="John Doe" onChange={handleFormChange} name="username" value={formData.username ?? ""} isRequired={false} error={error?.includes("name") ? error : undefined} />
                    <Input label="Email" id="studentEmail" type="email" placeholder="example09@gmail.com" onChange={handleFormChange} name="email" value={formData.email ?? ""} isRequired={false} error={error?.includes("email") ? error : undefined} />
                    <Input label="Password" id="studentPassword" type="password" placeholder="Password" onChange={handleFormChange} name="password" value={formData.password ?? ""} isRequired={false} error={error?.includes("password") || error?.includes("Passwords") || error?.includes("Password") ? error : undefined} />
                    <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleFormChange} name="confirmPassword" value={confirmPassword ?? ""} isRequired={false} error={error?.includes("Password") || error?.includes("Passwords") ? error : undefined} />
                    <Input label="Student LRN" id="studentLRN" type="number" placeholder="XXXXXXXXXXXX" onChange={handleFormChange} name="studentLRN" value={formData.studentLRN ?? ""} isRequired={false} error={error?.includes("LRN") || error?.includes("studentLRN") ? error : undefined} />
                    <Input label="Student ID" id="studentID" type="text" placeholder="2025-0000-ICP" onChange={handleFormChange} name="studentId" value={formData.studentId ?? ""} isRequired={false} error={error?.includes("ID") || error?.includes("studentId") ? error : undefined} />
                    <SelectionField label="Student Strand" id="studentStrand" value={formData.studentStrand ?? ""} onChange={handleFormChange} isRequired={false} 
                        placeholder="Select strand"
                        options={[
                            "ICT",
                            "HRCTO",
                            "GAS",
                            "HUMSS",
                            "ABM",
                            "STEM",
                            "AAD"
                        ]}
                    />
                    <Input label="Section" id="studentSection" type="text" placeholder="Section" onChange={handleFormChange} name="studentSection" value={formData.studentSection ?? ""} isRequired={false} />
                    <div className="flex justify-between items-center">
                        <button type="button" onClick={onClose} className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-500 font-bold py-1.5 px-4 rounded mt-2">
                            Cancel
                        </button>
                        <button type="button" onClick={() => handleUpdate(formData)} className={hasContent ? "bg-blue-800 hover:bg-blue-900 w-33 text-white py-1.5 px-4 rounded mt-2" : "bg-gray-500 w-33 text-white py-1.5 px-4 rounded mt-2"} disabled={!hasContent || isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
            {pendingFile && (
                <ImageCropModal
                    file={pendingFile}
                    onConfirm={handleCropConfirm}
                    onClose={() => setPendingFile(null)}
                />
            )}
        </div>
    );
}