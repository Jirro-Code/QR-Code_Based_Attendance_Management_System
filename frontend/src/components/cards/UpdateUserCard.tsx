import { useUpdate } from "../../hooks/useUpdate.ts";
import { useScrollToTop } from "../../hooks/useScrollToTop.ts";
import { useRef, useState } from "react";
import { Input }  from "../Input/Input.tsx";
import { type User } from "../../services/users.ts";
import { SelectionField } from "../Input/SelectionField.tsx";

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
    const { useScrollToTopOverflow } = useScrollToTop();
    const [formData, setFormData] = useState<User>({} as User);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const updateCardRef = useRef<HTMLDivElement>(null);
    const hasContent = Object.values(formData).some((value) => String(value ?? "").trim() !== "") || confirmPassword.trim() !== "";
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({...current, [e.target.name]: e.target.value}));
        if (e.target.name === "confirmPassword") {
            setConfirmPassword(e.target.value);
        }
    }
    
    const handleUpdate = async (data: User) => {
        try {
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
    };
    
    
    return (
        <div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50 p-4">
            <div className="bg-blue-800 p-6 rounded-tl-lg shadow-md flex flex-col justify-center max-w-md w-full h-20 relative">
                <button className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={onClose}>×</button>
                <h1 className="text-white text-lg font-bold">Update Student: <br/>{userName}</h1>
            </div>
            <div ref={updateCardRef} id="update-user-card" className="bg-white rounded-bl-lg shadow-lg p-6 relative flex flex-col gap-3 max-w-md w-full max-h-[80vh] overflow-y-auto">
                <p className="text-red-600 text-sm">{error}</p>
                
                <form className="flex flex-col gap-1">
                    <Input label="Student Name" id="studentName" type="text" placeholder="John Doe" onChange={handleFormChange} name="username" value={formData.username ?? ""} isRequired={false} />
                    <Input label="Email" id="studentEmail" type="email" placeholder="example09@gmail.com" onChange={handleFormChange} name="email" value={formData.email ?? ""} isRequired={false} />
                    <Input label="Password" id="studentPassword" type="password" placeholder="Password" onChange={handleFormChange} name="password" value={formData.password ?? ""} isRequired={false} />
                    <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleFormChange} name="confirmPassword" value={confirmPassword ?? ""} isRequired={false} />
                    <Input label="Student LRN" id="studentLRN" type="number" placeholder="XXXXXXXXXXXX" onChange={handleFormChange} name="studentLRN" value={formData.studentLRN ?? ""} isRequired={false} />
                    <Input label="Student ID" id="studentID" type="text" placeholder="2025-0000-ICP" onChange={handleFormChange} name="studentId" value={formData.studentId ?? ""} isRequired={false} />
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
                        <button type="button" onClick={() => handleUpdate(formData)} className={hasContent ? "bg-blue-800 hover:bg-blue-900 text-white py-1.5 px-4 rounded mt-2" : "bg-gray-500 text-white py-1.5 px-4 rounded mt-2"} disabled={!hasContent}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}