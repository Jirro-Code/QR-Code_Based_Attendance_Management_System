import { useArchive } from "../../../hooks/useArchive.ts";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";

type ArchiveAttendanceCardProps = {
    attendanceId: string;
    username: string;
    onArchived: (attendanceId: string) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string }>>;
    onClose: () => void;
};

export const ArchiveAttendanceCard = ({ attendanceId, username, onArchived, setShowNotification, onSetNotif, onClose }: ArchiveAttendanceCardProps) => {
    const [error, setError] = useState<string>("");
    const { useArchiveAttendance } = useArchive();
    const { useDisableScroll } = useScrollFunctions();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    useDisableScroll();
    
    const handleArchive = async () => {
        setIsSubmitting(true);
        try {
            await useArchiveAttendance(attendanceId, setError);
            onArchived(attendanceId);
            onSetNotif({
                title: "Archive Successful",
                message: "Attendance archived successfully!"
            });
            setShowNotification(true);
        }
        catch (error) {
            console.error("Error archiving attendance:", error);
            onSetNotif({ title: "Archive Failed", message: "Failed to archive attendance." });
            setShowNotification(true);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="not-scrollable-card fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3 max-w-xs w-full">
                <h1 className="text-red-800 text-base font-bold flex gap-1"><TriangleAlert/> Archive Attendance</h1>
                
                <p className="text-red-600 text-sm">{error}</p>
                
                <p className="text-gray-700 text-sm">
                    Are you sure you want to archive <b>{username}</b>'s attendance record?
                </p>
                
                <div className="flex justify-between items-center mt-1">
                    <button type="button" onClick={onClose} className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-500 font-bold py-1.5 px-4 rounded">
                        Cancel
                    </button>
                    <button type="button" onClick={handleArchive} disabled={isSubmitting} className="bg-red-700 hover:bg-red-800 w-28 text-white font-bold py-1.5 px-4 rounded">
                        {isSubmitting ? 'Archiving...' : 'Yes, Archive'}
                    </button>
                </div>
            </div>
        </div>
    );
};