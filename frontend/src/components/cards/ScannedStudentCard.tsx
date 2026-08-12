import { useState } from "react";
import { useCreate } from "../../hooks/useCreate.ts";
import style from "./Scanner.module.css";

type ScannedStudentCardProps = {
    scannedStudent: {
        uuid: string;
        username: string;
        studentStrand: string;
        studentSection: string;
    } | null;
    eventId: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    onClose: () => void;
};

export const ScannedStudentCard = ({ scannedStudent, eventId, onClose, setError }: ScannedStudentCardProps) => {
    const { useMarkAttendance } = useCreate();
    const [isLate, setIsLate] = useState<boolean>(false);
    const handleMarkPresent = async () => {
        if (!scannedStudent || !eventId) return;
        const result = await useMarkAttendance( { uuid: scannedStudent.uuid, eventId, isLate, setError } );
        if (result.result === "already_marked") {
            onClose();
            setError("Attendance already marked.");
            return;
        }
        if (result) {
            alert("Attendance marked successfully.");
            onClose();
        }
    };
    return (
        <div>
            <h2>Student Detected</h2>
            <p><strong>Username:</strong>{" "}{scannedStudent!.username}</p>
            <p><strong>Strand:</strong>{" "}{scannedStudent!.studentStrand}</p>
            <p><strong>Section:</strong>{" "}{scannedStudent!.studentSection}</p>
            
            <button onClick={() => setIsLate((prev) => !prev)} className={isLate ? style.late : style.notLate}>Set as late</button>
            <button onClick={handleMarkPresent}>Mark as Present</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    )
}