import { useDelete } from "../../hooks/useDelete.ts";
import { useState } from "react";

type DeleteCardUserProps = {
    userId: string;
    onDeleted: () => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    onClose: () => void;
}

export const DeleteUserCard = ({ userId, onDeleted, setShowNotification, onSetNotif, onClose }: DeleteCardUserProps) => {
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 relative flex flex-col gap-3 max-w-md w-full">
                <button className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={onClose}>×</button>
                <h2 className="text-lg font-semibold text-gray-800">Delete Card</h2>
                <p className="text-gray-600">This is the delete card component.</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button onClick={() => setShowConfirmation(true)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded self-start">Delete Student</button>
                
                {showConfirmation && (
                    <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-md flex flex-col gap-3">
                        <p className="text-gray-700">Are you sure you want to delete this student?</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleDelete()} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Yes, Delete</button>
                            <button onClick={() => setShowConfirmation(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    );
}