import { type Event } from "../../services/events.ts";
import { type Attendance } from "../../services/attendance.ts";
import { AttendanceListCell } from "../AttendanceListCell.tsx";
import { useView } from "../../hooks/useView.ts";
import { useEffect,  useState } from "react";
import { X } from "lucide-react";

type AttendanceCardProps = {
    event: Event;
    strand: string | null;
    onClose: () => void;
};

export const AttendanceCard = ({ event, strand, onClose }: AttendanceCardProps) => {
    const [attendanceArray, setAttendanceArray] = useState<Attendance[]>([]);
    const { useViewAttendanceByEventId, useViewAttendanceByStrand } = useView();
    const [error, setError] = useState<string>("");
    
    useEffect(() => {
        if (strand) {
            useViewAttendanceByStrand(event.id, strand, setError).then((data) => {
                setAttendanceArray(data);
            });
        } else {
            useViewAttendanceByEventId(event.id, setError).then((data) => {
                setAttendanceArray(data);
            });
        }
    }, [event.id, strand, setError]);
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 p-3 z-10 backdrop-blur-[2px]">
            <div className="z-100 border-gray-400 min-h-20 w-full rounded-md overflow-hidden shadow-sm relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="h-1/2 bg-blue-800 p-3 flex items-center">
                    <h2 className="text-white text-lg font-bold">{event.eventName}</h2>
                    {error && <p className="text-red-600 text-sm ml-4">{error}</p>}
                </div>
                <div className="bg-gray-200 h-100 overflow-y-auto">
                    <div className="grid grid-cols-[0.3fr_repeat(7,1fr)] border-b border-gray-300 bg-gray-400 px-5 py-3 text-sm font-semibold text-white">
                        <div>#</div>
                        <div>Name</div>
                        <div>Strand</div>
                        <div>Section</div>
                        <div>Student ID</div>
                        <div>Status</div>
                        <div>Time</div>
                        <div className="flex justify-end">Actions</div>
                    </div>
                    <div className="grid grid-cols-1">
                        {attendanceArray.length > 0 ? (
                            attendanceArray.map((attendance: Attendance) => (
                                <AttendanceListCell key={attendance.id} attendance={attendance} number={attendanceArray.indexOf(attendance) + 1} />
                            ))
                        ) : (
                            <p>No attendance records found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
        