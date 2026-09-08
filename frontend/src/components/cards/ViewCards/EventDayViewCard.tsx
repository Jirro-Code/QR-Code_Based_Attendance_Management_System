import { type Event } from "../../../services/events.ts";
import { CancelButton } from "../../Button";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions.ts";
import { Calendar } from "lucide-react";

type EventDayViewCardProps = {
    setSelectedDay: (day: number | null) => void;
    isArchived?: boolean;
    monthNames: string[];
    currentMonth: number;
    selectedDay: number;
    currentYear: number;
    selectedDayEvents: Event[];
};

export const EventDayViewCard = ({ setSelectedDay, isArchived, monthNames, currentMonth, selectedDay, currentYear, selectedDayEvents }: EventDayViewCardProps) => {
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    
    return (
        <div onClick={() => setSelectedDay(null)} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg w-full max-w-sm max-h-[80vh] flex flex-col">
                
                <div className={`flex items-center ${isArchived ? "bg-gray-500" : "bg-blue-800"} rounded-t-lg justify-between p-4 border-b border-slate-200`}>
                    <h3 className="font-semibold text-base text-white">
                        {monthNames[currentMonth - 1]} {selectedDay}, {currentYear}
                    </h3>
                    <CancelButton onClose={() => setSelectedDay(null)} color="white" />
                </div>
                
                <div className="scrollable-card overscroll-contain overflow-y-auto p-4 flex flex-col gap-3">
                    {selectedDayEvents.length === 0 ? 
                        <p className="text-sm text-gray-500">No events for this day.</p>
                        : 
                        selectedDayEvents.map((event, idx) => (
                            <div key={idx}
                                className="group flex items-center gap-3 text-left border border-gray-200 hover:bg-gray-100 rounded-md py-3 px-4 transition-colors duration-200">
                                <Calendar className={`${isArchived ? "text-gray-500" : "text-blue-800"} shrink-0`} size={18} />
                                <span className="min-w-0 flex-1">
                                    <span className="block font-semibold text-gray-800 truncate">{event.eventName}</span>
                                    <span className="block text-xs text-gray-500 truncate">{event.eventLocation}</span>
                                </span>
                            </div>
                            
                        ))
                    }
                </div>
            </div>
        </div>
    )
}