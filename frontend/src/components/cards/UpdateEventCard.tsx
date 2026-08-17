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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 relative flex flex-col gap-3 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <button className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={onClose}>×</button>
                <h2 className="text-lg font-semibold text-gray-800">Update Card</h2>
                <p className="text-gray-600">This is the update card component.</p>
                <form className="flex flex-col gap-1">
                    <Input label="Event Name" type="text" id="eventName" placeholder="Event Name" name="eventName" value={formData.eventName} onChange={handleFormChange} />
                    <Input label="Event Description" type="text" id="eventDescription" placeholder="Event Description (Optional)" name="eventDescription" value={formData.eventDescription} onChange={handleFormChange} isRequired={false} />
                    <Input label="Event Date" type="date" id="eventDate" placeholder="Event Date" name="eventDate" value={formData.eventDate} onChange={handleFormChange} />
                    <Input label="Event Location" type="text" id="eventLocation" placeholder="Event Location" name="eventLocation" value={formData.eventLocation} onChange={handleFormChange} />                
                    <button type="button" onClick={() => handleUpdate(formData)} className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mt-2">Update</button>
                    <p className="text-red-800 text-sm">{error}</p>
                </form>
            </div>
        </div>
    );
}