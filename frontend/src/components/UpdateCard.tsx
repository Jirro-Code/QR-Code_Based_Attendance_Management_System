import useUpdate from "../hooks/useUpdate.ts";
import {useState} from "react";
import Input from "./Input.tsx";
import { type User } from "../services/users.ts";
import SelectionField from "./SelectionField.tsx";
import NotificationCard from "./NotificationCard.tsx";

type UpdateCardProps = {
    userId: string;
    onUpdated: () => void;
};

function UpdateCard({ userId, onUpdated }: UpdateCardProps) {
    const [showNotification, setShowNotification] = useState(false);
    const { updateData } = useUpdate();
    const [formData, setFormData] = useState<User>({} as User);
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({...current, [e.target.name]: e.target.value}));
    }
    const handleUpdate = async (data: User) => {
        try {
            await updateData({ ...data, id: userId });
            onUpdated();
            setShowNotification(true);
        } 
        catch (error) {
            console.error("Error updating data:", error);
            setShowNotification(false);
        }
    };
    
    return (
        <div className="update-card">
            <h2>Update Card</h2>
            <p>This is the update card component.</p>
            <form className="update-form">
                <Input label="Student Name" id="studentName" type="text" placeholder="Student Name" onChange={handleFormChange} name="username" isRequired={false} />
                <Input label="Email" id="studentEmail" type="email" placeholder="Email" onChange={handleFormChange} name="email" isRequired={false} />
                <Input label="Password" id="studentPassword" type="password" placeholder="Password" onChange={handleFormChange} name="password" isRequired={false} />
                <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleFormChange} name="confirmPassword" isRequired={false} />
                <Input label="Student LRN" id="studentLRN" type="number" placeholder="Student LRN" onChange={handleFormChange} name="studentLRN" isRequired={false} />
                <Input label="Student ID" id="studentID" type="text" placeholder="Student ID" onChange={handleFormChange} name="studentId" isRequired={false} />
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
                <Input label="Section" id="studentSection" type="text" placeholder="Section" onChange={handleFormChange} name="studentSection" isRequired={false} />
                    
                <button type="button" onClick={() => handleUpdate(formData)}>
                    Update
                </button>
            </form>
            {showNotification && <NotificationCard title="Update Successful" message="Data updated successfully!" onClose={() => setShowNotification(false)} />}
        </div>
    );
}

export default UpdateCard;