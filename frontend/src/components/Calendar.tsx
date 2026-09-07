import { ChevronRight, ChevronLeft } from "lucide-react";
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
    
    const isEventDay = (day: number, month: number, year: number) => {
        return events.some((event) => {
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
    }
    
    const renderCalendarDays = (month: number, year: number) => {
        const daysInCurrentMonth = daysInMonth(month, year);
        const firstDayOfMonth = getFirstDayOfMonth(month, year);
        const days = [];
        
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div
                    key={`empty-start-${i}`}
                    className="h-10 sm:h-12 flex items-center justify-center text-sm rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm"
                />
            );
        }
        
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            const hasEvent = isEventDay(i, month, year);
            const today = isToday(i, month, year);
            days.push(
                <div key={`day-${i}`}
                    className={`h-10 sm:h-12 flex items-center justify-center text-sm rounded-lg ${hasEvent ? "border-r-2 border-l-2 border-blue-800" : "border-slate-200"} ${today ? "bg-gray-400/50 border-r-2 border-l-2 border-blue-800 italic font-semibold hover:bg-gray-500/50" : "bg-white hover:bg-gray-100"} p-6 text-left shadow-sm cursor-pointer`}>
                    {i}
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
    
    return (
        <div className="flex justify-center items-center mt-5 mb-5">
            <div className="bg-white rounded-lg shadow-md p-4 w-full relative">
                <div className="absolute top-4 right-2 flex justify-end">
                    {isAdmin && <CancelButton onClose={onClose!} color="gray-500" />}
                </div>
                <h2 className="text-xl font-semibold mb-4">
                    {monthNames[currentMonth - 1]} {currentYear}
                </h2>
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
        </div>
    );
};