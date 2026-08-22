import { type Event } from "../../services/events.ts";

type EventAttendanceCardProps = {
    event: Event;
    onView: (event: Event) => void;
};

export const EventAttendanceCard = ({ event, onView }: EventAttendanceCardProps) => {
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    return(
        <div onClick={() => onView(event)} className="group relative w-full pt-3 cursor-pointer transition duration-200">
            
            <div className="absolute left-0 top-0 h-5 w-25 rounded-t-md bg-blue-700 transition-colors duration-200 group-hover:bg-blue-800"
                style={{ clipPath: "polygon(0 0, 81% 0, 100% 100%, 0 100%)" }}
            />
            <div className="absolute z-2 left-0 top-3 h-3 w-23 rounded-tl-sm bg-blue-700 transition-colors duration-200 group-hover:bg-blue-800 rotate-180"
                style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" }}
            />
            
            <div className="relative w-[95%] overflow-hidden rounded-md rounded-tl-none bg-white shadow-sm transition duration-200 group-hover:shadow-xl">
                
                <div className="flex min-h-12 items-center bg-blue-800 p-3 transition-colors duration-200 group-hover:bg-blue-900">
                    <h3 className="text-[16px] font-bold mt-1 text-white overflow-hidden text-ellipsis whitespace-nowrap">{event.eventName}</h3>
                </div>
                
                <div className="flex items-center gap-1 p-3 mb-5">
                    <p className="text-sm text-gray-600">{formatDate(event.eventDate)}</p>
                </div>
            </div>
        </div>
    )
}