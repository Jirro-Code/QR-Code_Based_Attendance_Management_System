import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { useState, useEffect } from "react";
import { CancelButton } from "./Button";
import { useView } from "../hooks/useView.ts";
import { type Event } from "../services/events.ts";

type CalendarProps = {
    isAdmin: boolean;
    refreshEvents: number;
    onClose?: () => void;
};

export const Calendar = ({ isAdmin, onClose, refreshEvents }: CalendarProps) => {
    const { useViewAllEvents } = useView();
    const [events, setEvents] = useState<Event[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [error, setError] = useState<string>("");
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                await useViewAllEvents(setEvents, setError);
            } catch (error) {
                setError("Failed to fetch events");
            }
        };
        fetchEvents();
    }, [refreshEvents]);
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const daysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };
    
    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month - 1, 1).getDay();
    };
    
    const getEventsForDay = (day: number, month: number, year: number) => {
        return events.filter((event) => {
            const eventDate = new Date(event.eventDate);
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() + 1 === month &&
                eventDate.getFullYear() === year &&
                !event.isArchived
            );
        });
    };
    
    const isToday = (day: number, month: number, year: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() + 1 === month &&
            today.getFullYear() === year
        );
    };
    
    const renderCalendarDays = (month: number, year: number) => {
        const daysInCurrentMonth = daysInMonth(month, year);
        const firstDayOfMonth = getFirstDayOfMonth(month, year);
        const days = [];
        
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div
                    key={`empty-start-${i}`}
                    className="h-10 sm:h-12 lg:h-14 xl:h-16 flex items-center justify-center text-sm rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm"
                />
            );
        }
        
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            const dayEvents = getEventsForDay(i, month, year);
            const eventCount = dayEvents.length;
            const today = isToday(i, month, year);
            
            days.push(
                <div key={`day-${i}`} onClick={() => setSelectedDay(i)}
                    className={`relative h-10 sm:h-12 lg:h-14 xl:h-16 flex items-center justify-center text-sm rounded-lg border p-6 text-left shadow-sm cursor-pointer  ${
                        today ? "bg-gray-400 hover:bg-gray-500 font-semibold" : "border-slate-200 bg-white hover:bg-gray-100"
                    }`} >
                    {i}
                    
                    {eventCount > 0 && (
                        <div className="absolute top-0 right-0 w-7 h-7 overflow-hidden rounded-tr-lg pointer-events-none">
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-27 border-t-blue-600 border-l-27 border-l-transparent" />
                            <span className="absolute top-0.5 right-1 text-white text-[11px] font-semibold leading-none">
                                {eventCount > 9 ? "9+" : eventCount}
                            </span>
                        </div>
                    )}
                </div>
                
            );
        }
        
        return days;
    };
    
    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear((a) => a - 1);
        } else {
            setCurrentMonth((b) => b - 1);
        }
    };
    
    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear((a) => a + 1);
        } else {
            setCurrentMonth((b) => b + 1);
        }
    };
    
    const selectedDayEvents =
        selectedDay !== null ? getEventsForDay(selectedDay, currentMonth, currentYear) : [];
    
    return (
        <div className="flex justify-center flex-col items-center mt-5 mb-5">
            <div className="bg-blue-800 rounded-t-lg shadow-md pt-4 pr-4 pl-4 w-full flex justify-between items-center relative">
                <div className="absolute top-4 right-2 flex justify-end">
                    {isAdmin && <CancelButton onClose={onClose!} color="white" />}
                </div>
                <h2 className="text-xl font-semibold mb-4 text-white">
                    {monthNames[currentMonth - 1]} {currentYear}
                </h2>
            </div>
            <div className="bg-white rounded-b-lg shadow-md p-3 w-full">
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                <div className="flex justify-center items-center gap-2 mb-4">
                    <button onClick={handlePrevMonth}>
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="w-full grid grid-cols-7 gap-2">
                        <div className="font-semibold text-center text-xs sm:text-sm">Sun</div>
                        <div className="font-semibold text-center text-xs sm:text-sm">Mon</div>
                        <div className="font-semibold text-center text-xs sm:text-sm">Tue</div>
                        <div className="font-semibold text-center text-xs sm:text-sm">Wed</div>
                        <div className="font-semibold text-center text-xs sm:text-sm">Thu</div>
                        <div className="font-semibold text-center text-xs sm:text-sm">Fri</div>
                        <div className="font-semibold text-center text-xs sm:text-sm">Sat</div>
                        
                        {renderCalendarDays(currentMonth, currentYear)}
                    </div>
                    
                    <button onClick={handleNextMonth}>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {selectedDay !== null && selectedDayEvents.length > 0 && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDay(null)}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-sm max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-slate-200">
                            <h3 className="font-semibold text-base">
                                {monthNames[currentMonth - 1]} {selectedDay}, {currentYear}
                            </h3>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="p-1 rounded hover:bg-gray-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-4 flex flex-col gap-3">
                            {selectedDayEvents.length === 0 ? (
                                <p className="text-sm text-gray-500">No events for this day.</p>
                            ) : (
                                selectedDayEvents.map((event, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-slate-200 rounded-lg p-3 shadow-sm"
                                    >
                                        <p className="font-medium text-sm">
                                            {(event as Event).eventName ?? "Untitled event"}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {event.eventLocation}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};