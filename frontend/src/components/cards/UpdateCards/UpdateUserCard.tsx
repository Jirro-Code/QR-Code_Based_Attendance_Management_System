import { useUpdate } from "../../../hooks/useUpdate.ts";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";
import { useRef, useState } from "react";
import { Input }  from "../../Input/Input.tsx";
import { type User } from "../../../services/users.ts";
import { SelectionField } from "../../Input/SelectionField.tsx";
import { CancelButton } from "../../Button.tsx";
import { ImageCropModal } from "../../../components/ImageCrop.tsx";
import { ArrowLeftRight, X, Eye, EyeOff } from "lucide-react";

type UpdateUserCardProps = {
    student: Partial<User>;
    onUpdated: (updatedUser: User) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    onClose: () => void;
};

export const UpdateUserCard = ({ student, onUpdated, setShowNotification, onSetNotif, onClose }: UpdateUserCardProps) => {
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
    const [isHidden, setIsHidden] = useState(true);
    const [isHidden2, setIsHidden2] = useState(true);

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
            
            const updatedUser = await useUpdateUser({ ...filteredData, id: student.id! }, setError);
            
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
    
    const color = student.isArchived ? "gray-500" : "blue-800";
    
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50 p-3 sm:p-4">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-250 h-160 sm:h-140 lg:h-125 max-h-[90vh] flex flex-col rounded-lg shadow-lg overflow-hidden">
                
                <div className={`bg-${color} px-4 py-5 sm:px-6 flex items-center justify-between gap-3 shrink-0`}>
                    <h1 className="text-white text-xl font-bold wrap-break-words">{student.username}</h1>
                    <CancelButton onClose={onClose} color="white"/>
                </div>
                
                <div ref={updateCardRef} id="update-user-card" className="scrollable-card bg-white px-4 py-4 sm:px-6 sm:py-5 flex-1 overflow-y-auto overscroll-contain">
                    {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                    
                    <form className="flex flex-col gap-3">
                        <div className="flex flex-col mb-2 sm:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="profilePicture">
                                Profile Picture:
                            </label>
                            
                            {previewUrl ? (
                                <div className="mt-2 flex items-center gap-4 sm:gap-5">
                                    <img src={previewUrl} alt="Selected profile" className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover ring-1 ring-gray-200 shrink-0" />
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <span className="text-sm text-gray-700 truncate">{formData.profilePicture?.name}</span>
                                        <div className="flex gap-3">
                                            <label htmlFor="profilePicture" className="text-xs flex gap-1 items-center text-blue-800 hover:underline cursor-pointer">
                                                <ArrowLeftRight size={12} /> Change
                                            </label>
                                            <button type="button" onClick={handleRemovePicture} className="text-xs text-red-600 hover:underline flex items-center gap-0.5">
                                                <X size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm" id="profilePicture" type="file" name="profilePicture" accept="image/png,image/jpeg,image/webp" onChange={handleFileSelected} required/>
                            )}
                            
                            {previewUrl && ( <input className="hidden" id="profilePicture" type="file" name="profilePicture" accept="image/png,image/jpeg,image/webp" onChange={handleFileSelected} required />)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                            
                            <Input label="Student Name" id="studentName" type="text" placeholder="John Doe" onChange={handleFormChange} name="username" value={formData.username ?? ""} isRequired={false} error={error?.includes("name") ? error : undefined} />
                            <Input label="Email" id="studentEmail" type="email" placeholder="example09@gmail.com" onChange={handleFormChange} name="email" value={formData.email ?? ""} isRequired={false} error={error?.includes("email") ? error : undefined} />
                            <div className="relative">
                                <Input label="Password" id="studentPassword" type={isHidden ? "password" : "text" } placeholder="Password" onChange={handleFormChange} name="password" value={formData.password ?? ""} isRequired={false} error={error?.includes("password") || error?.includes("Passwords") || error?.includes("Password") ? error : undefined} />
                                <button type="button" onClick={() => setIsHidden(!isHidden)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-600 focus:outline-none bg-white">
                                    {isHidden ? <EyeOff size={"20"} /> : <Eye size={"20"} />}
                                </button>
                            </div>
                            <div className="relative">
                                <Input label="Confirm Password" id="confirmPassword" type={isHidden2 ? "password" : "text" } placeholder="Confirm Password" onChange={handleFormChange} name="confirmPassword" value={confirmPassword ?? ""} isRequired={false} error={error?.includes("Password") || error?.includes("Passwords") ? error : undefined} />
                                <button type="button" onClick={() => setIsHidden2(!isHidden2)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-600 focus:outline-none bg-white">
                                    {isHidden2 ? <EyeOff size={"20"} /> : <Eye size={"20"} />}
                                </button>
                            </div>
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
                        </div>
                    </form>
                </div>
                
                <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4 shrink-0 flex flex-row justify-between items-center gap-2 sm:gap-3">
                    <button type="button" onClick={onClose} className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-500 font-bold py-1.5 px-4 rounded">
                        Cancel
                    </button>
                    <button type="button" onClick={() => handleUpdate(formData)} className={`w-33 text-white py-1.5 px-4 rounded ${hasContent ? "bg-blue-800 hover:bg-blue-900" : "bg-gray-500"}`} disabled={!hasContent || isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
            {pendingFile && <ImageCropModal file={pendingFile} onConfirm={handleCropConfirm} onClose={() => setPendingFile(null)}/>}
        </div>
    );
}