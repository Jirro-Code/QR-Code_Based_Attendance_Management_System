import { useUpdate } from "../../../hooks/useUpdate.ts";
import { useState } from "react";
import { type Attendance } from "../../../services/attendance.ts";
import { UserPen } from "lucide-react";

type UpdateAttendanceCardProps = {
    attendance: Partial<Attendance>;
    studentName: string;
    onUpdated: (updatedAttendance: Attendance) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string }>>;
    onClose: () => void;
};

export const UpdateAttendanceCard = ({ attendance, studentName, onUpdated, setShowNotification, onSetNotif, onClose }: UpdateAttendanceCardProps) => {
    const { useUpdateAttendance } = useUpdate();
    const [error, setError] = useState<string>("");
    
    const targetLabel = attendance.isLate ? "On Time" : "Late";
    const targetValue = !attendance.isLate; // flip current status
    
    const handleToggleStatus = async () => {
        try {
            if (!attendance.id) return;
            
            const updatedAttendance = await useUpdateAttendance(attendance.id, targetValue, setError);
            
            onUpdated(updatedAttendance);
            onSetNotif({
                title: "Update Successful",
                message: `Attendance marked as ${targetLabel}!`
            });
            setShowNotification(true);
        }
        catch (error) {
            console.error("Error updating attendance:", error);
            onSetNotif({ title: "Update Failed", message: "Failed to update attendance." });
        }
    }; 
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-5 flex flex-col gap-3 max-w-xs w-full">
                <h1 className="text-blue-800 text-base font-bold flex gap-1"><UserPen /> Update Attendance</h1>
                
                <p className="text-red-600 text-sm">{error}</p>
                
                <p className="text-gray-700 text-sm">
                    Mark <b>{studentName}</b> as <span className={targetLabel === "On Time" ? "font-semibold text-green-800" : "font-semibold text-red-800"}>{targetLabel}</span> instead?
                </p>
                
                <div className="flex justify-between items-center mt-1">
                    <button type="button" onClick={onClose} className="bg-gray-100 border border-gray-400 hover:bg-gray-200 text-gray-500 font-bold py-1.5 px-4 rounded">
                        Cancel
                    </button>
                    <button type="button" onClick={handleToggleStatus} className="bg-blue-800 hover:bg-blue-900 text-white py-1.5 px-4 rounded">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}