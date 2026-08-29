import { useState } from "react";
import { useCreate } from "../../hooks/useCreate.ts";

type ScannedStudentCardProps = {
    scannedStudent: {
        uuid: string;
        username: string;
        studentStrand: string;
        studentSection: string;
    } | null;
    eventId: string;
    setNotificationMessage: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    onClose: () => void;
};

export const ScannedStudentCard = ({ scannedStudent, setNotificationMessage, setShowNotification, eventId, onClose, setError }: ScannedStudentCardProps) => {
    const { useMarkAttendance } = useCreate();
    const [isLate, setIsLate] = useState<boolean>(false);
    const handleMarkPresent = async () => {
        if (!scannedStudent || !eventId) return;
        const result = await useMarkAttendance( { uuid: scannedStudent.uuid, eventId, isLate, setError } );
        
        if (result.result.includes("invalid_data")) {
            const errorMessage = result.result.split("|")[1] || "Invalid attendance data.";
            setNotificationMessage({ title: "Error", message: errorMessage });
            setShowNotification(true);
            onClose();
            return;
        }
        if (result.result.includes("not_found")) {
            const errorMessage = result.result.split("|")[1] || "Event or student not found.";
            setNotificationMessage({ title: "Error", message: errorMessage });
            setShowNotification(true);
            onClose();
            return;
        }        
        if (result.result === "already_marked") {
            setNotificationMessage({ title: "Attendance Already Marked", message: "This student has already been marked present for this event." });
            setShowNotification(true);
            onClose();
            return;
        }        
        if (result) {
            setNotificationMessage({ title: "Attendance Marked", message: "The student has been successfully marked present for this event." });
            setShowNotification(true);
            onClose();
        }
    };
    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-6 flex flex-col gap-4 max-w-sm w-full z-50 justify-center items-center">
            <h2 className="text-xl font-bold text-gray-800">Student Detected</h2>
            <div className="flex flex-col gap-2">
                <p><strong>Username:</strong>{" "}{scannedStudent!.username}</p>
                <p><strong>Strand:</strong>{" "}{scannedStudent!.studentStrand}</p>
                <p><strong>Section:</strong>{" "}{scannedStudent!.studentSection}</p>
            </div>
            
            <button className={isLate ? 'bg-red-500 text-white  py-2 px-4 rounded-lg font-medium hover:bg-red-800 transition-colors' : 'bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 transition-colors'} onClick={() => setIsLate((prev) => !prev)}>Set as late</button>
            <button className="bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 transition-colors" onClick={handleMarkPresent}>Mark as Present</button>
            <button className="bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-800 transition-colors" onClick={onClose}>Cancel</button>
        </div>
    )
}