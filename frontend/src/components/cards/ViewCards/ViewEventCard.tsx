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
        return new Date(dateString).toLocaleString("en-US", {
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
            <div className="bg-white pt-6 pb-7 px-9 rounded-b-lg shadow-md flex flex-col gap-2 max-w-md w-full">
                <p className="text-gray-700"><b>Description:</b> <p className="scrollable-card bg-gray-100 border rounded-sm border-gray-300 p-2 w-full h-20 overflow-x-auto overscroll-contain whitespace-normal wrap-break-word">{event.eventDescription}</p></p>
                <p className="text-gray-700"><b>Date:</b> {formatDate(event.eventDate!)}</p>
                <p className="text-gray-700"><b>Location:</b> {event.eventLocation}</p>
                <p className="text-gray-500 text-sm"><b>Created by:</b> {event.creator}</p>
                <p className="text-gray-500 text-sm"><b>Created at:</b> {formatDateTime(event.createdAt!)}</p>
                <p className="text-gray-500 text-sm"><b>Last updated at:</b> {formatDateTime(event.updatedAt!)}</p>
                <div className="flex justify-end items-center mt-4">
                    <button onClick={onUpdate} className="mt-5 flex items-center justify-center gap-2 bg-none border border-blue-900 hover:bg-gray-100 text-blue-900 py-1 px-8 rounded"><SquarePen size={16} /> Edit</button>
                </div>
            </div>
        </div>
    );
}