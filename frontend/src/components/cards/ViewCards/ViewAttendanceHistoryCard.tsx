import { useView } from "../../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Attendance } from "../../../services/attendance";
import { type User } from "../../../services/users";
import { type Event } from "../../../services/events";
import { AttendanceHistoryListCell } from "../../ListCells/AttendanceHistoryListCell.tsx";
import { CancelButton } from "../../Button.tsx";

type AttendanceHistoryCardProps = {
    student: Partial<User>;
    onClose: () => void;
};



export const AttendanceHistoryCard = ({ student, onClose }: AttendanceHistoryCardProps) => {
    const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
    const [error, setError] = useState<string>("");
    const [events, setEvents] = useState<Record<string, Partial<Event>>>({});
    const { useViewAttendanceByStudentId, useViewEventById } = useView();
    
    useEffect(() => {
        const fetchAttendanceHistory = async () => {
            try {
                const data = await useViewAttendanceByStudentId(student.id!, "admin-login", setError);
                setAttendanceHistory(data);
                
                const fetchedEvents = await Promise.all(
                    data.map(async (attendance) => {
                        const event = await useViewEventById(attendance.eventId, setError);
                        return [attendance.eventId, event] as const;
                    })
                );
                
                setEvents(Object.fromEntries(fetchedEvents));
            
            } catch (error) {
                console.error("Error fetching attendance history:", error);
            }
        };
        
        fetchAttendanceHistory();
    }, [ student.id ]);
    
    const color = student.isArchived ? "gray-500" : "blue-800";
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-3 z-10 backdrop-blur-[2px]">
            <div className="w-full max-w-4xl rounded-md overflow-hidden shadow-xl relative">
                <div className="flex justify-end">
                    <CancelButton onClose={onClose} color="white"/>
                </div>
                <div className={`bg-${color} p-4`}>
                    <h2 className="text-xl font-bold text-white">{student.username}</h2>
                    <p>{error}</p>
                </div>
                <div>
                    <div className="scrollable-card bg-gray-50 h-100 overflow-y-auto overscroll-contain">
                        <div className="grid grid-cols-[0.3fr_repeat(7,1fr)] border-b border-gray-200 bg-white sticky top-0 px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide shadow-sm">
                            <div>#</div>
                            <div>Name</div>
                            <div>Strand</div>
                            <div>Section</div>
                            <div>Student ID</div>
                            <div>Status</div>
                            <div>Time</div>
                            <div className="flex justify-end">Actions</div>
                        </div>
                        
                        <div className="grid grid-cols-1 divide-y divide-gray-100">
                            {
                                attendanceHistory.length > 0 ? (
                                    attendanceHistory.map((attendance, index) => (
                                        <AttendanceHistoryListCell
                                            key={attendance.id}
                                            attendance={attendance}
                                            event={events[attendance.eventId]}
                                            student={student}
                                            number={index + 1}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 text-sm py-10">No attendance records found.</p>
                                )
                            }
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}