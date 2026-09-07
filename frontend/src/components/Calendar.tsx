import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { CancelButton } from "./Button";

type CalendarProps = {
    isAdmin: boolean
    onClose?: () => void;
};

export const Calendar = ({ isAdmin, onClose }: CalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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

    const renderCalendarDays = (month: number, year: number) => {
        const daysInCurrentMonth = daysInMonth(month, year);
        const firstDayOfMonth = getFirstDayOfMonth(month, year);
        const days = [];

        // leading empty cells (bago mag-start ang month)
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-start-${i}`} className="h-10 sm:h-12 flex items-center justify-center text-sm rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm hover:bg-gray-100" />
            );
        }
        
        // actual days
        for (let i = 1; i <= daysInCurrentMonth; i++) {
            days.push(
                <div key={`day-${i}`} className="h-10 sm:h-12 flex items-center justify-center text-sm rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm hover:bg-gray-100 cursor-pointer">
                    {i}
                </div>
            );
        }
        
        return days;
    };
    
    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    };
    
    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
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