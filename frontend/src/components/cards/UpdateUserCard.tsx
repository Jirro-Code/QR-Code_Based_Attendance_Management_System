import { useUpdate } from "../../hooks/useUpdate.ts";
import { useState } from "react";
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
    const [formData, setFormData] = useState<User>({} as User);
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({...current, [e.target.name]: e.target.value}));
        if (e.target.name === "confirmPassword") {
            setConfirmPassword("");
        }
    }
    
    const handleUpdate = async (data: User) => {
        try {
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
            onSetNotif({
                title: "Update Failed",
                message: "Failed to update data.",
            });
        }
    };
    
    
    return (
        <div className="update-card">
            <button className="close-button" onClick={onClose}>×</button>
            <h2>Update Card</h2>
            <p>This is the update card component.</p>
            <form className="update-form">
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
                
                <button type="button" onClick={() => handleUpdate(formData)}>Update</button>
                <p>{error}</p>
            </form>
        </div>
    );
}