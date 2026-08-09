import { useDelete } from "../../hooks/useDelete.ts";
import { useState } from "react";

type DeleteCardProps = {
    userId: string;
    onDeleted: () => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
}

export const DeleteCard = ({ userId, onDeleted, setShowNotification, onSetNotif }: DeleteCardProps) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState<string>("");
    const { useDeleteStudent } = useDelete();
    
    const handleDelete = async () => {
        try {
            await useDeleteStudent(userId, setError);
            onDeleted();
            onSetNotif({
                title: "Delete Successful",
                message: "Student deleted successfully!"
            });
            setShowConfirmation(false);
            setShowNotification(true);
        } 
        catch (error) {
            console.error("Error deleting student:", error);
            onSetNotif({
                title: "Delete Failed",
                message: "Failed to delete student."
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
                Delete Student
            </button>
            
            {showConfirmation && (
                <div className="delete-confirmation card">
                    <p>Are you sure you want to delete this student?</p>
                    <button onClick={handleDelete}>Yes, Delete</button>
                    <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                </div>
            )}
            
        </div>
    );
}