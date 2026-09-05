import { type Event } from "../../../services/events.ts";
import { type Attendance } from "../../../services/attendance.ts";
import { AttendanceListCell } from "../../ListCells/AttendanceListCell.tsx";
import { NotificationCard } from "./../NotificationCard.tsx";
import { useView } from "../../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";
import { CancelButton } from "../../Button.tsx";

type AttendanceCardProps = {
    event: Event;
    strand: string | null;
    section: string | null;
    isOnArchive: boolean;
    onComplete: () => void;
    onClose: () => void;
};

export const AttendanceCard = ({ event, strand, section, isOnArchive, onClose, onComplete }: AttendanceCardProps) => {
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    const { useViewAttendanceByEventId } = useView();
    const [attendanceArray, setAttendanceArray] = useState<Attendance[]>([]);
    const [error, setError] = useState<string>("");
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string }>({
        title: "",
        message: ""
    });
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    const sortByAttendedAt = (data: Attendance[]) =>
        [...data].sort((a, b) => new Date(a.attendedAt).getTime() - new Date(b.attendedAt).getTime());
    
    useEffect(() => {
        useViewAttendanceByEventId(event.id, setError).then((data) => {
            if (strand) {
                data = data.filter((attendance) => attendance.strand === strand);
            }
            if (section) {
                data = data.filter((attendance) => attendance.section === section);
            }
            setAttendanceArray(sortByAttendedAt(data));
        });
        
    }, [event.id, strand, setError]);
    
    const onUpdatedAttendance = (updated: Attendance) => {
        setAttendanceArray((prev) =>
            prev.map((a) => a.id === updated.id ? updated : a)
        );
    }
    
    const onArchivedAttendance = (deletedId: string) => {
        onComplete();
        setAttendanceArray((prev) => prev.filter((a) => a.id !== deletedId));
    };
    
    const isArchivedRecord = (attendance: Attendance) =>
    attendance.isArchived === true ||
    attendance.isArchivedByStudent === true ||
    attendance.isArchivedByEvent === true;
    
    const color = isOnArchive ? "gray-500" : "blue-800";
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-3 z-10 backdrop-blur-[2px]">
            <div className="z-100 bg-white w-full max-w-4xl rounded-md overflow-hidden shadow-xl relative">
                
                <div className={`bg-${color} px-5 py-4 flex flex-col gap-1.5 relative`}>
                    <button className="absolute top-3 right-3">
                        <CancelButton onClose={onClose} color="white" />
                    </button>
                    
                    <h1 className="w-4/5 text-white text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                        {event.eventName}
                    </h1>
                    
                    <div className="w-full flex justify-between items-center">
                        {strand ? (<h4 className="text-white/90 text-sm">{strand}</h4>) : <p className="text-white/90 text-sm">No strand selected</p>}
                        {section ? (<h4 className="text-white/90 text-sm">{section}</h4>) : <p className="text-white/90 text-sm">No section selected</p>}
                        <h4 className="text-white/90 text-sm">{formatDate(event.eventDate)}</h4>
                    </div>
                    {error && (<p className="text-red-700 px-2 py-1 text-sm w-fit mt-1">{error}</p>)}
                </div>
                
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
                            isOnArchive ? (
                                attendanceArray.filter(isArchivedRecord).length > 0 ? (
                                    attendanceArray.filter(isArchivedRecord).map((attendance: Attendance, index: number) => (
                                        <AttendanceListCell key={attendance.id} attendance={attendance} number={index + 1}
                                            onUpdated={(attendance) => onUpdatedAttendance(attendance)}
                                            onRestored={(attendanceId) => onArchivedAttendance(attendanceId)}
                                            setShowNotification={setShowNotification}
                                            onSetNotif={setNotificationMessage}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 text-sm py-10">No attendance records found.</p>
                                )
                            ) : (
                                attendanceArray.filter((attendance) => !isArchivedRecord(attendance)).length > 0 ? (
                                    attendanceArray.filter((attendance) => !isArchivedRecord(attendance)).map((attendance: Attendance, index: number) => (
                                        <AttendanceListCell key={attendance.id} attendance={attendance} number={index + 1}
                                            onUpdated={(attendance) => onUpdatedAttendance(attendance)}
                                            onArchived={(attendanceId) => onArchivedAttendance(attendanceId)}
                                            setShowNotification={setShowNotification}
                                            onSetNotif={setNotificationMessage}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 text-sm py-10">No attendance records found.</p>
                                )
                            )
                        }
                    </div>
                    
                </div>
            </div>
            
            {showNotification && (<NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)}/>)}
        </div>
    );
}