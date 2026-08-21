import { type Attendance } from "../../services/attendance.ts";
import { type User } from "../../services/users.ts";
import { useView } from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { Trash2, SquarePen } from "lucide-react";
import { UpdateAttendanceCard } from "../Cards/UpdateCards/UpdateAttendanceCard.tsx";
import { DeleteAttendanceCard } from "../Cards/DeleteCards/DeleteAttendanceCard.tsx";

type ListCellProps = {
    attendance: Partial<Attendance>;
    number: number;
    onUpdated: (updatedAttendance: Attendance) => void;
    onDelete: (attendanceId: string) => void;
    setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
    onSetNotif: React.Dispatch<React.SetStateAction<{ title: string; message: string }>>;
};

export const AttendanceListCell = ({ attendance, number, onUpdated, onDelete, setShowNotification, onSetNotif }: ListCellProps) => {
    const [user, setUser] = useState<Partial<User>>();
    const [showUpdateCard, setShowUpdateCard] = useState<boolean>(false);
    const [showDeleteCard, setShowDeleteCard] = useState<boolean>(false);
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
                <button onClick={() => setShowDeleteCard(true)}>
                    <Trash2 className="w-4 h-4 text-red-800" />
                </button>
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
            
            {showDeleteCard && (
                <DeleteAttendanceCard
                    attendanceId={attendance.id!}
                    username={user?.username ?? "this student"}
                    onDeleted={(attendance) => {
                        onDelete(attendance);
                        setShowDeleteCard(false);
                    }}
                    onClose={() => setShowDeleteCard(false)}
                    setShowNotification={setShowNotification}
                    onSetNotif={onSetNotif}
                />
            )}
        </div>
    );
};