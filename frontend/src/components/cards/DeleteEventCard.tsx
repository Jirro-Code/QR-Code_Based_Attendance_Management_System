import { useDelete } from "../../hooks/useDelete.ts";
import { useState } from "react";

type DeleteCardEventProps = {
    eventId: string;
    onDeleted: () => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
}

export const DeleteEventCard = ({ eventId, onDeleted, setShowNotification, onSetNotif }: DeleteCardEventProps) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState<string>("");
    const { useDeleteEvent } = useDelete();
    
    const handleDelete = async () => {
        try {
            await useDeleteEvent(eventId, setError);
            onDeleted();
            onSetNotif({
                title: "Delete Successful",
                message: "Event deleted successfully!"
            });
            setShowConfirmation(false);
            setShowNotification(true);
        } 
        catch (error) {
            console.error("Error deleting event:", error);
            onSetNotif({
                title: "Delete Failed",
                message: "Failed to delete event."
            });
            setShowNotification(true);
        }
    };
    
    
    return (
        <div className="delete-card">
            <h2>Delete Card</h2>
            <p>This is the delete card component.</p>
            <p>{error}</p>
            <button onClick={() => setShowConfirmation(true)}>
                Delete Event
            </button>
            
            {showConfirmation && (
                <div className="delete-confirmation card">
                    <p>Are you sure you want to delete this event?</p>
                    <button onClick={() => handleDelete()}>Yes, Delete</button>
                    <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                </div>
            )}
            
        </div>
    );
}