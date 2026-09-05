import { useView } from "../../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Attendance } from "../../../services/attendance";
import { type User } from "../../../services/users";
import { type Event } from "../../../services/events";
import { AttendanceHistoryListCell } from "../../ListCells/AttendanceHistoryListCell.tsx";
import { CancelButton } from "../../Button.tsx";
import { SelectionField } from "../../Input/SelectionField.tsx";
import { Input } from "../../Input/Input.tsx";

type AttendanceHistoryCardProps = {
    student: Partial<User>;
    onClose: () => void;
};

export const AttendanceHistoryCard = ({ student, onClose }: AttendanceHistoryCardProps) => {
    const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
    const [error, setError] = useState<string>("");
    const [events, setEvents] = useState<Map<string, Partial<Event>>>(new Map());
    const [month, setMonth] = useState<string>("");
    const [day, setDay] = useState<string>("");
    const [year, setYear] = useState<string>("");
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
                
                setEvents(new Map(fetchedEvents));
            } catch (error) {
                console.error("Error fetching attendance history:", error);
            }
        };
        
        fetchAttendanceHistory();
    }, [student.id]);
    
    
    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(event.target.value);
    };
    
    const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDay(event.target.value);
    };
    
    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(event.target.value);
    };
    
    const visibleAttendance = attendanceHistory
        .filter((attendance) => attendance.isArchived === false)
            .filter((attendance) => {
                if (!year) return true;
                const event = events.get(attendance.eventId);
                if (!event?.eventDate) return false;
                return new Date(event.eventDate).getFullYear().toString() === year;
            })
            .filter((attendance) => {
                if (!month) return true;
                const event = events.get(attendance.eventId);
                if (!event?.eventDate) return false;
                return new Date(event.eventDate).toLocaleString("en-PH", { month: "long" }) === month;
            })
            .filter((attendance) => {
                if (!day) return true;
                const event = events.get(attendance.eventId);
                if (!event?.eventDate) return false;
                return new Date(event.eventDate).getDate() === parseInt(day, 10);
    });
    
    const color = student.isArchived ? "gray-500" : "blue-800";
    
    const inputClassName = "mt-1 bg-white block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-slate-400 focus:border-slate-400";
    
    const selectionClassName = "mt-1 bg-white block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-slate-400 focus:border-slate-400 text-gray-500";
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-3 z-10 backdrop-blur-[2px]">
            <div className="w-full max-w-4xl rounded-md overflow-hidden shadow-xl relative">
                <div className={`bg-${color} p-4`}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">{student.username}</h2>
                        <CancelButton onClose={onClose} color="white" />
                    </div>
                    <div className="flex justify-end">
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex h-9 max-h-9 gap-2">
                                <div className="w-28">
                                    <SelectionField 
                                        id="month-filter" 
                                        className={selectionClassName}
                                        value={month} 
                                        onChange={handleMonthChange} 
                                        isRequired={false} 
                                        placeholder="Month"
                                        options={[
                                            "January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ]}
                                    />
                                </div>
                                
                                <div className="w-16">
                                    <Input 
                                        className={inputClassName}
                                        type="text" 
                                        id="day" 
                                        placeholder="Day" 
                                        name="day" 
                                        value={day} 
                                        onChange={handleDayChange} 
                                    />
                                </div>
                                
                                <div className="w-24">
                                    <SelectionField 
                                        className={selectionClassName}
                                        id="year-filter" 
                                        value={year} 
                                        onChange={handleYearChange} 
                                        isRequired={false} 
                                        placeholder="Year"
                                        options={[
                                            "2020", "2021", "2022", "2023", "2024", "2025",
                                            "2026", "2027", "2028", "2029", "2030"
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-700">{error}</p>}
                </div>
                <div>
                    <div className="scrollable-card bg-gray-50 h-100 overflow-y-auto overscroll-contain">
                        <div className="grid grid-cols-[0.3fr_repeat(5,1fr)] border-b border-gray-200 bg-white sticky top-0 px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide shadow-sm">
                            <div>#</div>
                            <div>Event</div>
                            <div>Date</div>
                            <div>Location</div>
                            <div>Status</div>
                            <div>Time</div>
                        </div>
                        
                        <div className="grid grid-cols-1 divide-y divide-gray-100">
                            {visibleAttendance.length > 0 ? (
                                visibleAttendance.map((attendance, index) => (
                                    <AttendanceHistoryListCell
                                        key={attendance.id}
                                        attendance={attendance}
                                        event={events.get(attendance.eventId)}
                                        number={index + 1}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-400 text-sm py-10">No attendance records found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};