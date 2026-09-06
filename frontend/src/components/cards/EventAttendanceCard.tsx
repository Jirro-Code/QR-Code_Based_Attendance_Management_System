import { type Event } from "../../services/events.ts";

type EventAttendanceCardProps = {
    event: Event;
    isArchived: boolean;
    onView: (event: Event) => void;
};

export const EventAttendanceCard = ({ event, isArchived, onView }: EventAttendanceCardProps) => {
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    
    return(
        <div onClick={() => onView(event)} className="group relative w-full pt-3 cursor-pointer transition duration-200">
            
            <div className={`absolute left-0 z-2 -top-1 h-8 w-23 ${isArchived ? 'bg-gray-600' : 'bg-blue-900'} transition-colors duration-200 ${isArchived ? 'group-hover:bg-gray-700' : 'group-hover:bg-blue-950'}`}
                style={{ clipPath: ` polygon( 0 0, 81% 0, 100% 50%, 81% 100%, 0 100% )`,}}/>
            
            <div className="relative max-w-62 overflow-hidden rounded-md rounded-tl-none bg-white shadow-sm transition duration-200 group-hover:shadow-xl">
                
                <div className={`flex min-h-15 items-center ${isArchived ? 'bg-gray-500' : 'bg-blue-800'} p-3 transition-colors duration-200 ${isArchived ? 'group-hover:bg-gray-600' : 'group-hover:bg-blue-900'}`}>
                    <h3 className="text-[16px] font-bold mt-1 text-white overflow-hidden text-ellipsis whitespace-nowrap">{event.eventName}</h3>
                </div>
                
                <div className="flex items-center gap-1 p-3 mb-6">
                    <p className="text-sm text-gray-600">{formatDate(event.eventDate)}</p>
                </div>
            </div>
        </div>
    )
}