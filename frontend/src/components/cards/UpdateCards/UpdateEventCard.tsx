import { useUpdate } from "../../../hooks/useUpdate.ts";
import { useState } from "react";
import { Input }  from "../../Input/Input.tsx";
import { type Event } from "../../../services/events.ts";
import { CancelButton } from "../../Button.tsx";

type UpdateEventCardProps = {
    event: Partial<Event>;
    isDisabled: boolean;
    onUpdated: (updatedEvent: Event) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    onClose: () => void;
};

export const UpdateEventCard = ({ event, isDisabled, onUpdated, setShowNotification, onSetNotif, onClose }: UpdateEventCardProps) => {
    const { useUpdateEvent } = useUpdate();
    const [formData, setFormData] = useState<Event>({} as Event);
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const hasContent = Object.values(formData).some((value) => String(value ?? "").trim() !== "")
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((current) => ({...current, [e.target.name]: e.target.value}));
    }
    
    
    const handleUpdate = async (data: Event) => {
        setIsSubmitting(true);
        try {
            const updatedEvent = await useUpdateEvent({ ...data, id: event.id! }, setError);
            onUpdated(updatedEvent);
            setFormData({} as Event);
            await useUpdateEvent({ ...data, id: event.id! }, setError);
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
        finally {
            setIsSubmitting(false);
        }
    };
    
    const color = event.isArchived ? "gray-500" : "blue-800";
    
    
    return (
        <div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center z-50 p-4">
            <div className={`flex max-w-md w-full rounded-t-lg px-6 py-5 justify-between items-center bg-${color}`}>
                <h1 className="text-xl font-bold w-80 text-white overflow-hidden text-ellipsis">{event.eventName}</h1>
                <CancelButton onClose={onClose} color="white" />
            </div>
            <div className="bg-white rounded-b-lg shadow-lg p-6 relative flex flex-col gap-3 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <p className="text-red-600 text-sm">{error}</p>
                
                <form className="flex flex-col gap-1">
                    <Input label="Event Name" type="text" id="eventName" placeholder="Event Name" name="eventName" value={formData.eventName} onChange={handleFormChange} />
                    <Input label="Event Description" type="textarea" id="eventDescription" placeholder="Event Description (Optional)" name="eventDescription" value={formData.eventDescription} onChange={handleFormChange} isRequired={false} />
                    { !isDisabled && (
                        <Input label="Event Date" type="date" id="eventDate" placeholder="Event Date" name="eventDate" value={formData.eventDate} onChange={handleFormChange} />
                    )}
                    <Input label="Event Location" type="text" id="eventLocation" placeholder="Event Location" name="eventLocation" value={formData.eventLocation} onChange={handleFormChange} />
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
        </div>
    );
}