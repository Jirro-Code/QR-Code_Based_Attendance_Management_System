import { useState } from "react";
import { useCreate } from "../../hooks/useCreate.ts";
import { type User } from "../../services/users.ts";


type ScannedStudentCardProps = {
    student: Partial<User>;
    profilePicture: string | null;
    eventId: string;
    setNotificationMessage: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string>>;
    onClose: () => void;
};

export const ScannedStudentCard = ({ student, profilePicture, setNotificationMessage, setShowNotification, eventId, onClose, setError }: ScannedStudentCardProps) => {
    const { useMarkAttendance } = useCreate();
    const [isLate, setIsLate] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    
    
    
    const handleMarkPresent = async () => {
        setLoading(true);
        try {
            if (!student?.id || !eventId) return;
            const result = await useMarkAttendance( { uuid: student.id, eventId, isLate, setError } );
            
            if (result.result?.includes("invalid_data")) {
                const errorMessage = result.result.split("|")[1] || "Invalid attendance data.";
                setNotificationMessage({ title: "Error", message: errorMessage });
                setShowNotification(true);
                onClose();
                return;
            }
            if (result.result?.includes("not_found")) {
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
                return;
            }
        } 
        catch (error) {
            setNotificationMessage({ title: "Error", message: `${error instanceof Error ? error.message : "An unknown error occurred"}` });
            setShowNotification(true);
            onClose();
            return;
        }
        finally {
            setLoading(false);
        }
    };
    return (
        
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-3 z-50 backdrop-blur-[2px]">
            
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm z-50 overflow-hidden">
                
                <div className="p-6 flex flex-col items-center gap-5">
                    <h2 className="text-lg font-semibold text-gray-900">Student Detected</h2>
                    
                    <div className="relative">
                        {profilePicture ? (
                            <img src={profilePicture} alt="Profile"
                                className="w-40 h-40 rounded-md object-cover ring-4 ring-gray-100"
                            />
                        ) : (
                            <div className="w-40 h-40 rounded-full bg-gray-100 ring-4 ring-gray-50 flex items-center justify-center">
                                <span className="text-gray-400 text-sm">No Photo</span>
                            </div>
                        )}
                        <div
                            className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white ${
                                isLate ? 'bg-red-600' : 'bg-green-600'
                            }`}
                        />
                    </div>
                    
                    <div className="w-full flex flex-col divide-y divide-gray-100 border-y border-gray-100">
                        <div className="flex justify-between py-2.5 text-sm">
                            <span className="text-gray-500">Name</span>
                            <span className="min-w-0 max-w-[65%] truncate font-medium text-gray-900" title={student?.username}>{student?.username}</span>
                        </div>
                        <div className="flex justify-between py-2.5 text-sm">
                            <span className="text-gray-500">Strand</span>
                            <span className="min-w-0 max-w-[65%] truncate font-medium text-gray-900" title={student?.studentStrand}>{student?.studentStrand}</span>
                        </div>
                        <div className="flex justify-between py-2.5 text-sm">
                            <span className="text-gray-500">Section</span>
                            <span className="min-w-0 max-w-[65%] truncate font-medium text-gray-900" title={student?.studentSection}>{student?.studentSection}</span>
                        </div>
                    </div>
                    
                    
                    <div className="w-full flex flex-col gap-3 pt-1">
                        <button onClick={() => setIsLate((prev) => !prev)} className={`w-full flex items-center justify-center px-4 py-2.5 rounded-xl border transition-colors ${
                                isLate
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-gray-600 text-white hover:bg-gray-700'
                            }`}>
                            <span className="text-sm font-medium">Mark as late</span>
                        </button>
                        <div className="flex justify-between gap-10 mt-5">
                            <button onClick={onClose} className="w-full text-gray-500 py-2 border border-gray-500 hover:bg-gray-50 rounded-xl font-medium text-sm transition-colors" >
                                Cancel
                            </button>
                            <button onClick={handleMarkPresent} className="w-full border border-blue-800 text-white bg-blue-800 py-2.5 rounded-xl font-medium text-sm hover:border-blue-900 hover:bg-blue-900 transition-colors" disabled={loading}>
                                {loading ? 'Processing...' : `Mark as ${isLate ? 'Late' : 'Present'}`}
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}