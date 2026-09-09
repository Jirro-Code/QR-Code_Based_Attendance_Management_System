import { useView } from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Attendance } from "../../services/attendance";
import { type User } from "../../services/users";
import { type Event } from "../../services/events";
import { useCurrentUser } from "../../hooks/useCurrentUser.ts";
import { AttendanceHistoryListCell } from "../../components/ListCells/AttendanceHistoryListCell.tsx";
import { SelectionField } from "../../components/Input/SelectionField.tsx";
import { Input } from "../../components/Input/Input.tsx";
import { Header } from "../../components/Header.tsx";


export const AttendanceHistoryPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
    const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
    const [error, setError] = useState<string>("");
    const [events, setEvents] = useState<Map<string, Partial<Event>>>(new Map());
    const [month, setMonth] = useState<string>("");
    const [day, setDay] = useState<string>("");
    const [year, setYear] = useState<string>("");
    const { useViewAttendanceByStudentId, useViewEventById } = useView();
    const [student, setStudent] = useState<Partial<User>>({
        id: "",
        username: "",
        studentStrand: "",
        studentSection: "",
        email: "",
        role: "user",
    });
    
    useCurrentUser("/student-login", setStudent);
    useEffect(() => {
        const studentId = student.id;
        if (!studentId) return;
        
        const fetchAttendanceHistory = async () => {
            try {
                const data = await useViewAttendanceByStudentId(studentId, "/student-login", setError);
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
    
    
    const inputClassName = "mt-1 bg-white block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-slate-400 focus:border-slate-400";
    
    const selectionClassName = "mt-1 bg-white block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-slate-400 focus:border-slate-400 text-gray-500";
    
    return (
        <>  
            <Header title="Attendance History" path="/student-dashboard" />
            <div className="inset-0 min-h-screen bg-slate-100">
                <div className="w-full h-screen relative">
                    <div className={"bg-slate-100 p-2 pr-4"}>
                        <div className="flex justify-end">
                            <div className="flex justify-between items-center">
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
                        <div className="bg-gray-50">
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
                                    <p className="text-center bg-gray-100 text-gray-400 text-sm h-50 flex justify-center items-center">No attendance records found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};