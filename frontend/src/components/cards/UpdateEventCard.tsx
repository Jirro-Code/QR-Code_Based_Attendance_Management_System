import { useUpdate } from "../../hooks/useUpdate.ts";
import { useState } from "react";
import { Input }  from "../Input/Input.tsx";
import { type Event } from "../../services/events.ts";

type UpdateEventCardProps = {
    id: string;
    onUpdated: (updatedEvent: Event) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    onClose: () => void;
};

export const UpdateEventCard = ({ id, onUpdated, setShowNotification, onSetNotif, onClose }: UpdateEventCardProps) => {
    const { useUpdateEvent } = useUpdate();
    const [formData, setFormData] = useState<Event>({} as Event);
    const [error, setError] = useState<string>("");
    
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({...current, [e.target.name]: e.target.value}));
    }
    
    const handleUpdate = async (data: Event) => {
        try {
            const updatedEvent = await useUpdateEvent({ ...data, id: id }, setError);
            onUpdated(updatedEvent);
            setFormData({} as Event);
            await useUpdateEvent({ ...data, id: id }, setError);
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
                <Input label="Event Name" type="text" id="eventName" placeholder="Event Name" name="eventName" value={formData.eventName} onChange={handleFormChange} />
                <Input label="Event Description" type="text" id="eventDescription" placeholder="Event Description (Optional)" name="eventDescription" value={formData.eventDescription} onChange={handleFormChange} isRequired={false} />
                <Input label="Event Date" type="date" id="eventDate" placeholder="Event Date" name="eventDate" value={formData.eventDate} onChange={handleFormChange} />
                <Input label="Event Location" type="text" id="eventLocation" placeholder="Event Location" name="eventLocation" value={formData.eventLocation} onChange={handleFormChange} />                
                <button type="button" onClick={() => handleUpdate(formData)}>Update</button>
                <p>{error}</p>
            </form>
        </div>
    );
}