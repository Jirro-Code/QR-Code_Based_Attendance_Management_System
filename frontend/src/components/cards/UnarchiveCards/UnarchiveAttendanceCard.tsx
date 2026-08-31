import { useArchive } from "../../../hooks/useArchive.ts";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";

type UnarchiveAttendanceCardProps = {
    attendanceId: string;
    username: string;
    onArchived: (attendanceId: string) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string }>>;
    onClose: () => void;
};

export const UnarchiveAttendanceCard = ({ attendanceId, username, onArchived, setShowNotification, onSetNotif, onClose }: UnarchiveAttendanceCardProps) => {
    const [error, setError] = useState<string>("");
    const { useUnarchiveAttendance } = useArchive();
    const { useDisableScroll } = useScrollFunctions();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    useDisableScroll();
    
    const handleUnarchive = async () => {
        setIsSubmitting(true);
        try {
            await useUnarchiveAttendance(attendanceId, setError);
            onArchived(attendanceId);
            onSetNotif({
                title: "Unarchive Successful",
                message: "Attendance unarchived successfully!"
            });
            setShowNotification(true);
        }
        catch (error) {
            console.error("Error unarchiving attendance:", error);
            onSetNotif({ title: "Unarchive Failed", message: "Failed to unarchive attendance." });
            setShowNotification(true);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="not-scrollable-card fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3 max-w-xs w-full">
                <h1 className="text-blue-900 text-base font-bold flex gap-1"><TriangleAlert/> Unarchive Attendance</h1>
                
                <p className="text-red-800 text-sm">{error}</p>
                
                <p className="text-gray-700 text-sm">
                    Are you sure you want to unarchive <b>{username}</b>'s attendance record?
                </p>
                
                <div className="flex justify-between items-center mt-1">
                    <button type="button" onClick={onClose} className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-500 font-bold py-1.5 px-4 rounded">
                        Cancel
                    </button>
                    <button type="button" onClick={handleUnarchive} disabled={isSubmitting} className="bg-blue-800 hover:bg-blue-900 w-32 text-white font-bold py-1.5 px-4 rounded">
                        {isSubmitting ? 'Unarchiving...' : 'Yes, Unarchive'}
                    </button>
                </div>
            </div>
        </div>
    );
};