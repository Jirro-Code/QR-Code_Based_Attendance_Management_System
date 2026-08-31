import { type Event } from "../../../services/events";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions";
import { CancelButton } from "../../Button";
import { SquarePen } from "lucide-react";

type ViewEventCardProps = {
    event: Partial<Event>;
    onClose: () => void;
    onUpdate: () => void;
};

export const ViewEventCard = ({ event, onClose, onUpdate }: ViewEventCardProps) => {
    const { useDisableScroll } = useScrollFunctions();
    useDisableScroll();
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center flex-col justify-center z-30 p-4">
            <div className="flex max-w-md w-full rounded-t-lg px-9 py-5 justify-between items-center bg-blue-800">
                <p className="font-bold text-2xl text-white w-80 overflow-hidden text-ellipsis whitespace-nowrap">{event.eventName}</p>
                <CancelButton onClose={onClose} />
            </div>
            <div className="bg-white pt-6 pb-7 px-9 rounded-b-lg shadow-md flex flex-col gap-3 max-w-md w-full">
                <div>
                    <p className="text-gray-700 font-bold mb-1">Description</p>
                    <p className="scrollable-card bg-gray-100 border border-gray-300 rounded-md p-3 w-full h-20 overflow-y-auto overscroll-contain whitespace-normal wrap-break-word text-sm text-gray-600 leading-relaxed">
                        {event.eventDescription}
                    </p>
                </div>
                <div className="w-full flex flex-col divide-y divide-gray-100 border-y border-gray-100">
                    <div className="flex justify-between py-2.5 text-sm">
                        <span className="font-medium text-gray-900">Date:</span>
                        <span className="text-gray-700">{formatDate(event.eventDate!)}</span>
                    </div>
                    <div className="flex justify-between py-2.5 text-sm">
                        <span className="font-medium text-gray-900">Location:</span>
                        <span className="text-gray-700">{event.eventLocation}</span>
                    </div>
                </div>
                
                <div className="border-t border-gray-200 pt-2 mt-1 flex flex-col gap-1">
                    <p className="text-gray-500 text-sm"><b>Created by:</b> {event.creator}</p>
                    <p className="text-gray-500 text-sm"><b>Created at:</b> {formatDateTime(event.createdAt!)}</p>
                    <p className="text-gray-500 text-sm"><b>Last updated at:</b> {formatDateTime(event.updatedAt!)}</p>
                </div>
                
                <div className="flex justify-end items-center mt-2">
                    <button onClick={onUpdate} className="flex items-center justify-center gap-2 bg-none border border-blue-900 hover:bg-gray-100 text-blue-900 py-1 px-8 rounded transition-colors">
                        <SquarePen size={16} /> Edit
                    </button>
                </div>
            </div>
        </div>
    );
}