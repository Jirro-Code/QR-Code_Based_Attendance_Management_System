import { useUpdate } from "../../hooks/useUpdate.ts";
import { useScrollToTop } from "../../hooks/useScrollToTop.ts";
import { useRef, useState } from "react";
import { Input }  from "../Input/Input.tsx";
import { type User } from "../../services/users.ts";
import { SelectionField } from "../SelectionField.tsx";

type UpdateUserCardProps = {
    userId: string;
    onUpdated: (updatedUser: User) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    onClose: () => void;
};

export const UpdateUserCard = ({ userId, onUpdated, setShowNotification, onSetNotif, onClose }: UpdateUserCardProps) => {
    const { useUpdateUser } = useUpdate();
    const { useScrollToTopOverflow } = useScrollToTop();
    const [formData, setFormData] = useState<User>({} as User);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const updateCardRef = useRef<HTMLDivElement>(null);
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({...current, [e.target.name]: e.target.value}));
        if (e.target.name === "confirmPassword") {
            setConfirmPassword(e.target.value);
        }
    }
    
    const handleUpdate = async (data: User) => {
        try {
            if (data.password !== confirmPassword) {
                
                useScrollToTopOverflow(updateCardRef);
                setError("Passwords do not match!");
                return;
            }
            const updatedUser = await useUpdateUser({ ...data, id: userId }, setError);
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
            console.error("Error updating data:", error);
            onSetNotif({ title: "Update Failed",message: "Failed to update data." });
        }
    };
    
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div ref={updateCardRef} id="update-user-card" className="bg-white rounded-lg shadow-lg p-6 relative flex flex-col gap-3 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <button className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={onClose}>×</button>
                <h2 className="text-lg font-semibold text-gray-800">Update Card</h2>
                <p className="text-red-600 text-sm">{error}</p>
                <p className="text-gray-600">This is the update card component.</p>
                
                <form className="flex flex-col gap-1">
                    <Input label="Student Name" id="studentName" type="text" placeholder="Student Name" onChange={handleFormChange} name="username" value={formData.username ?? ""} isRequired={false} />
                    <Input label="Email" id="studentEmail" type="email" placeholder="Email" onChange={handleFormChange} name="email" value={formData.email ?? ""} isRequired={false} />
                    <Input label="Password" id="studentPassword" type="password" placeholder="Password" onChange={handleFormChange} name="password" value={formData.password ?? ""} isRequired={false} />
                    <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleFormChange} name="confirmPassword" value={confirmPassword ?? ""} isRequired={false} />
                    <Input label="Student LRN" id="studentLRN" type="number" placeholder="Student LRN" onChange={handleFormChange} name="studentLRN" value={formData.studentLRN ?? ""} isRequired={false} />
                    <Input label="Student ID" id="studentID" type="text" placeholder="Student ID" onChange={handleFormChange} name="studentId" value={formData.studentId ?? ""} isRequired={false} />
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
                    
                    <button type="button" onClick={() => handleUpdate(formData)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2">Update</button>
                </form>
            </div>
        </div>
    );
}