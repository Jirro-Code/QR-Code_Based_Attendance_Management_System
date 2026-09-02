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
    isOnArchive: boolean;
    onComplete: () => void;
    onClose: () => void;
};

export const AttendanceCard = ({ event, strand, isOnArchive, onClose, onComplete }: AttendanceCardProps) => {
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    const { useViewAttendanceByEventId, useViewAttendanceByStrand } = useView();
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
        if (strand) {
            useViewAttendanceByStrand(event.id, strand, setError).then((data) => {
                setAttendanceArray(sortByAttendedAt(data));
            });
        } else {
            useViewAttendanceByEventId(event.id, setError).then((data) => {
                setAttendanceArray(sortByAttendedAt(data));
            });
        }
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
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 p-3 z-10 backdrop-blur-[2px]">
            <div className="z-100 border-gray-400 min-h-20 w-full rounded-md overflow-hidden shadow-sm relative">
                
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <CancelButton onClose={onClose} color="white" />
                </button>
                
                <div className={`h-1/2 bg-${color} p-3 flex flex-col justify-center gap-1`}>
                    <h1 className="w-80 text-white text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">{event.eventName}</h1>
                    <div className="w-full flex justify-between items-center">
                        {strand ? <h4 className="text-white text-sm"><b>Strand:</b> {strand}</h4> : <div></div>}
                        <h4 className="text-white text-sm">{formatDate(event.eventDate)}</h4>
                    </div>
                    {error && <p className="text-red-600 text-sm ml-4">{error}</p>}
                </div>
                
                
                <div className="scrollable-card bg-gray-200 h-100 overflow-y-auto overscroll-contain">
                    
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
                                    <p>No attendance records found.</p>
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
                                    <p>No attendance records found.</p>
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