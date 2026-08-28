import { type Event } from "../../services/events";
import { Calendar, Eye, Archive, ArchiveRestore } from "lucide-react";

type EventListCellProps = {
    event: Partial<Event>;
    onLoadView: () => void;
    isOnArchivedPage: boolean;
    onArchive?: () => void;
    onRestore?: () => void;
};

export const EventCard = ({ event, onArchive, onRestore, onLoadView, isOnArchivedPage }: EventListCellProps) => {
    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
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
                <button
                    onClick={onLoadView}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    View
                </button>
                {isOnArchivedPage ? 
                    <button
                        onClick={onRestore}
                        className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded-lg transition-colors"
                        aria-label="Restore event"
                    >
                        <ArchiveRestore className="w-4 h-4" />
                    </button>
                    : 
                    (
                        <button
                            onClick={onArchive}
                            className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg transition-colors"
                            aria-label="Delete event"
                        >
                            <Archive className="w-4 h-4" />
                        </button>
                    )
                }
            </div>
        </div>
    );
}