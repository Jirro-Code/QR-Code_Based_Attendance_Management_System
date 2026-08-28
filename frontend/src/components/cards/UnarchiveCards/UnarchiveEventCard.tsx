import { TriangleAlert } from "lucide-react";
import { useArchive } from "../../../hooks/useArchive.ts";
import { useState } from "react";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";

type UnarchiveCardEventProps = {
    id: string;
    eventName: string;
    onRestored: () => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    onClose: () => void;
}

export const UnarchiveEventCard = ({ id, eventName, onRestored, setShowNotification, onSetNotif, onClose }: UnarchiveCardEventProps) => {
    const [error, setError] = useState<string>("");
    const { useUnarchiveEvent } = useArchive();
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    
    const handleUnarchive = async () => {
        try {
            await useUnarchiveEvent(id, setError);
            onRestored();
            onSetNotif({
                title: "Unarchive Successful",
                message: "Event unarchived successfully!"
            });
            setShowNotification(true);
            onSetNotif({
                title: "Unarchive Successful",
                message: "Event unarchived successfully!"
            });
        } 
        catch (error) {
            console.error("Error archiving event:", error);
            onSetNotif({
                title: "Unarchive Failed",
                message: "Failed to unarchive event."
            });
            setShowNotification(true);
        }
    };
    
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3 max-w-xs w-full">
                <h1 className="text-blue-900 text-base font-bold flex gap-1"><TriangleAlert/> Unarchive Event</h1>
                
                <p className="text-red-800 text-sm">{error}</p>
                
                <p className="text-gray-700 text-sm overflow-hidden text-ellipsis">
                    Are you sure you want to unarchive <b >{eventName}</b>?
                </p>
                
                <div className="flex justify-between items-center mt-1">
                    <button type="button" onClick={onClose} className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-500 font-bold py-1.5 px-4 rounded">
                        Cancel
                    </button>
                    <button type="button" onClick={handleUnarchive} className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-1.5 px-4 rounded">
                        Yes, Unarchive
                    </button>
                </div>
            </div>
        </div>
    );
}