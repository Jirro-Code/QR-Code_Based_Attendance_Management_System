import { type Attendance } from "../../services/attendance.ts";
import { type User } from "../../services/users.ts";
import { useView } from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { Archive, ArchiveRestore, SquarePen } from "lucide-react";
import { UpdateAttendanceCard } from "../Cards/UpdateCards/UpdateAttendanceCard.tsx";
import { ArchiveAttendanceCard } from "../Cards/ArchiveCards/ArchiveAttendanceCard.tsx";
import { UnarchiveAttendanceCard } from "../Cards/UnarchiveCards/UnarchiveAttendanceCard.tsx";

type ListCellProps = {
    attendance: Partial<Attendance>;
    number: number;
    onUpdated: (updatedAttendance: Attendance) => void;
    onArchived?: (attendanceId: string) => void;
    onRestored?: (attendanceId: string) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string }>>;
};

export const AttendanceListCell = ({ attendance, number, onUpdated, onArchived, onRestored, setShowNotification, onSetNotif }: ListCellProps) => {
    const [user, setUser] = useState<Partial<User>>();
    const [showUpdateCard, setShowUpdateCard] = useState<boolean>(false);
    const [showArchiveCard, setShowArchiveCard] = useState<boolean>(false);
    const [showUnarchiveCard, setShowUnarchiveCard] = useState<boolean>(false);
    const { useViewUser } = useView();
    
    useEffect(() => {
        if (attendance.userId) {
            useViewUser(attendance.userId, () => {}).then((data) => {
                setUser(data);
            });
        }
    }, [attendance.userId]);
    
    return (
        <div className={number % 2 === 0 ? "bg-white grid grid-cols-[0.3fr_repeat(7,1fr)] items-center px-5 py-4 text-sm" : "bg-gray-200 grid grid-cols-[0.3fr_repeat(7,1fr)] items-center px-5 py-4 text-sm"}>
            <div className="text-gray-500">{number}</div>
            <div className="font-medium text-gray-800 px-0.5">{user?.username}</div>
            <div className="text-gray-600 px-0.5">{user?.studentStrand}</div>
            <div className="text-gray-600 px-0.5">{user?.studentSection}</div>
            <div className="text-gray-600 px-0.5">{user?.studentId}</div>
            <div className="px-0.5">{attendance.isLate ?
                (<p className="text-red-800">Late</p>) :
                (<p className="text-green-800">On Time</p>)}
            </div>
            <div className="text-gray-600 px-0.5"><p>{new Date(attendance.attendedAt!).toLocaleTimeString("en-PH", { timeZone: "Asia/Manila", hour: "2-digit", minute: "2-digit", hour12: true })}</p></div>
            <div className="flex justify-end items-center gap-4">
                <button onClick={() => setShowUpdateCard(true)}>
                    <SquarePen className="w-4 h-4 text-blue-800" />
                </button>
                {onRestored ? 
                    (
                        <button onClick={() => setShowUnarchiveCard(true)}>
                            <ArchiveRestore className="w-4 h-4 text-green-800" />
                        </button>
                    ) : 
                    (
                        <button onClick={() => setShowArchiveCard(true)}>
                            <Archive className="w-4 h-4 text-yellow-800" />
                        </button>
                    )
                }
            </div>
            
            {showUpdateCard && (
                <UpdateAttendanceCard
                    attendance={attendance}
                    studentName={user?.username ?? "this student"}
                    onUpdated={(updated) => {
                        onUpdated(updated);
                        setShowUpdateCard(false);
                    }}
                    setShowNotification={setShowNotification}
                    onSetNotif={onSetNotif}
                    onClose={() => setShowUpdateCard(false)}
                />
            )}
            
            {showArchiveCard && (
                <ArchiveAttendanceCard
                    attendanceId={attendance.id!}
                    username={user?.username ?? "this student"}
                    onArchived={(attendance) => {
                        onArchived?.(attendance);
                        setShowArchiveCard(false);
                    }}
                    onClose={() => setShowArchiveCard(false)}
                    setShowNotification={setShowNotification}
                    onSetNotif={onSetNotif}
                />
            )}
            {showUnarchiveCard && (
                <UnarchiveAttendanceCard
                    attendanceId={attendance.id!}
                    username={user?.username ?? "this student"}
                    onArchived={(attendance) => {
                        onRestored?.(attendance);
                        setShowUnarchiveCard(false);
                    }}
                    onClose={() => setShowUnarchiveCard(false)}
                    setShowNotification={setShowNotification}
                    onSetNotif={onSetNotif}
                />
            )}
        
        </div>
    );
};