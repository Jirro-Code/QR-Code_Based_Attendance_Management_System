import { type Event } from "../../services/events";
import { Calendar, Eye } from "lucide-react";

type EventListCellProps = {
    event: Partial<Event>;
    onLoadView: () => void;
};

export const EventPageCard = ({ event, onLoadView }: EventListCellProps) => {
    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    const color = event.isArchived ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-800 hover:bg-blue-900";
    
    return (
        <div className="group w-[95%] flex flex-col border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow bg-white">
            <h3 className="font-semibold text-gray-900 truncate" title={event.eventName}>
                {event.eventName}
            </h3>
            
            <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-500">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{formatDate(event.eventDate!)}</span>
            </div>
            
            <div className="flex gap-2 mt-5">
                <button onClick={onLoadView} className={`flex-1 flex items-center justify-center gap-1.5 ${color} text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors`}>
                    <Eye className="w-4 h-4" />
                    View
                </button>
            </div>
        </div>
    );
}