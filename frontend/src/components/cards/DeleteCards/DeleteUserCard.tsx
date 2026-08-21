import { TriangleAlert } from "lucide-react";
import { useDelete } from "../../../hooks/useDelete.ts";
import { useState } from "react";

type DeleteCardUserProps = {
    userId: string;
    username: string;
    onDeleted: () => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    onClose: () => void;
}

export const DeleteUserCard = ({ userId, username, onDeleted, setShowNotification, onSetNotif, onClose }: DeleteCardUserProps) => {
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
            <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3 max-w-xs w-full">
                <h1 className="text-red-800 text-base font-bold flex gap-1"><TriangleAlert/> Delete User</h1>
                
                <p className="text-red-600 text-sm">{error}</p>
                
                <p className="text-gray-700 text-sm">
                    Are you sure you want to delete <b>{username}</b>?
                </p>
                
                <div className="flex justify-between items-center mt-1">
                    <button type="button" onClick={onClose} className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-500 font-bold py-1.5 px-4 rounded">
                        Cancel
                    </button>
                    <button type="button" onClick={handleDelete} className="bg-red-700 hover:bg-red-800 text-white font-bold py-1.5 px-4 rounded">
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}