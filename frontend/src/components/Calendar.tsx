import { ChevronRight, ChevronLeft} from "lucide-react";
import { useState, useEffect } from "react";
import { CancelButton } from "./Button";
import { useView } from "../hooks/useView.ts";
import { type Event } from "../services/events.ts";
import { EventDayViewCard } from "./Cards/ViewCards/EventDayViewCard.tsx";

type CalendarProps = {
    isAdmin: boolean;
    isArchived?: boolean;
    refreshEvents: Event[];
    onClose?: () => void;
};

export const Calendar = ({ isAdmin, isArchived, onClose, refreshEvents }: CalendarProps) => {
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
                !isArchived ? (
                eventDate.getDate() === day &&
                eventDate.getMonth() + 1 === month &&
                eventDate.getFullYear() === year &&
                !event.isArchived
                ) : (
                eventDate.getDate() === day &&
                eventDate.getMonth() + 1 === month &&
                eventDate.getFullYear() === year &&
                event.isArchived
                )
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
                    className="h-10 sm:h-12 lg:h-14 xl:h-16 flex items-center justify-center text-sm rounded-lg border border-slate-200 bg-white hover:bg-gray-100 p-6 text-left shadow-sm"
                />
            );
        }
        
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            const dayEvents = getEventsForDay(i, month, year);
            const eventCount = dayEvents.length;
            const today = isToday(i, month, year);
            
            days.push(
                <div key={`day-${i}`} onClick={() => setSelectedDay(i)}
                    className={`relative flex h-10 sm:h-12 lg:h-14 xl:h-16 items-center justify-center text-sm rounded-lg border p-6 text-left shadow-sm ${
                        today ? `border-slate-400 ${isArchived ? "bg-gray-200 hover:bg-gray-300" : "bg-blue-100 hover:bg-blue-200"} font-semibold underline` : "border-slate-200 bg-white hover:bg-gray-100" } ${
                        eventCount > 0 ? "cursor-pointer" : "cursor-default" }
                    }`} >
                    {i}
                    {eventCount > 0 && (
                        <div className="absolute top-0 right-0 w-7 h-7 lg:h-10 lg:w-10 xl:h-13 xl:w-13 overflow-hidden rounded-tr-lg pointer-events-none">
                            <div className={`absolute ${ isArchived ? "border-t-gray-500" : "border-t-blue-700" } top-0 right-0 w-0 h-0 border-t-27 border-l-27 lg:border-t-32 lg:border-l-32 xl:border-t-35 xl:border-l-35 border-l-transparent`} />
                            <span className={`absolute top-0.5 right-0.5 text-white text-[10px] lg:text-[12px] xl:text-[14px] font-semibold leading-none`}>
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
            <div className={`${isArchived ? "bg-gray-500" : "bg-blue-800"} rounded-t-lg shadow-md pt-4 pr-4 pl-4 w-full flex justify-between items-center relative`}>
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
            
            {selectedDay !== null && selectedDayEvents.length > 0 && <EventDayViewCard {...{  isArchived, setSelectedDay, monthNames, currentMonth, selectedDay, currentYear, selectedDayEvents }} />}
        </div>
    );
};