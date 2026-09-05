
import { type Attendance } from "../../services/attendance.ts";
import { type Event } from "../../services/events.ts";

type ListCellProps = {
    attendance: Attendance;
    event?: Partial<Event>;
    number: number;
};

export const AttendanceHistoryListCell = ({ attendance, event, number }: ListCellProps) => {
    
    const dateFormatter = new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    
    const timeFormatter = new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    
    return (
        <div className={`${number % 2 === 0 ? "bg-white" : "bg-gray-50"} grid grid-cols-[0.3fr_repeat(5,1fr)] items-center px-5 py-3.5 text-sm hover:bg-blue-50/50 transition-colors`}>
            <div className="text-gray-400 font-medium">{number}</div>
            <div className="font-semibold text-gray-800 px-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{event?.eventName ?? "Loading..."}</div>
            <div className="text-gray-600 px-0.5">{dateFormatter.format(new Date(event?.eventDate ?? new Date())) ?? "Loading..."}</div>
            <div className="text-gray-600 px-0.5">{event?.eventLocation ?? "Loading..."}</div>
            <div className="px-0.5">
                {attendance.isLate ? (
                    <p className="inline-flex items-center gap-1 text-red-800 text-xs font-semibold px-2.5 py-1">Late</p>
                ) : (
                    <p className="inline-flex items-center gap-1 text-green-800 text-xs font-semibold px-2.5 py-1">On Time</p>
                )}
            </div>
            <div className="text-gray-600 px-0.5">
                {timeFormatter.format(new Date(attendance.attendedAt!))}
            </div>
        </div>
    );
};
