import { TriangleAlert } from "lucide-react";
import { useArchive } from "../../../hooks/useArchive.ts";
import { useState } from "react";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";

type ArchiveCardEventProps = {
    id: string;
    eventName: string;
    onDeleted: () => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    onClose: () => void;
}

export const ArchiveEventCard = ({ id, eventName, onDeleted, setShowNotification, onSetNotif, onClose }: ArchiveCardEventProps) => {
    const [error, setError] = useState<string>("");
    const { useArchiveEvent } = useArchive();
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    
    const handleDelete = async () => {
        try {
            await useArchiveEvent(id, setError);
            onDeleted();
            onSetNotif({
                title: "Archive Successful",
                message: "Event archived successfully!"
            });
            setShowNotification(true);
            onSetNotif({
                title: "Archive Successful",
                message: "Event archived successfully!"
            });
        } 
        catch (error) {
            console.error("Error archiving event:", error);
            onSetNotif({
                title: "Archive Failed",
                message: "Failed to archive event."
            });
            setShowNotification(true);
        }
    };
    
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3 max-w-xs w-full">
                <h1 className="text-red-800 text-base font-bold flex gap-1"><TriangleAlert/> Archive Event</h1>
                
                <p className="text-red-600 text-sm">{error}</p>
                
                <p className="text-gray-700 text-sm overflow-hidden text-ellipsis">
                    Are you sure you want to archive <b >{eventName}</b>?
                </p>
                
                <div className="flex justify-between items-center mt-1">
                    <button type="button" onClick={onClose} className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-500 font-bold py-1.5 px-4 rounded">
                        Cancel
                    </button>
                    <button type="button" onClick={handleDelete} className="bg-red-700 hover:bg-red-800 text-white font-bold py-1.5 px-4 rounded">
                        Yes, Archive
                    </button>
                </div>
            </div>
        </div>
    );
}