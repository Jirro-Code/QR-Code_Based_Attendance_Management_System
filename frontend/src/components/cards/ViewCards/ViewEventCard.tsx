import { type Event } from "../../../services/events";
import { useScrollFunctions } from "../../../hooks/useScrollFunctions";

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
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 p-4">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-2 max-w-md w-full">
                <p className="text-gray-700"><b>Event Name:</b> <p className="overflow-hidden text-ellipsis whitespace-nowrap">{event.eventName}</p></p>
                <p className="text-gray-700"><b>Description:</b> <p className="scrollable-card bg-gray-100 border rounded-sm border-gray-300 p-2 w-full h-20 overflow-x-auto overscroll-contain whitespace-normal wrap-break-word">{event.eventDescription}</p></p>
                <p className="text-gray-700"><b>Date:</b> {formatDate(event.eventDate!)}</p>
                <p className="text-gray-700"><b>Location:</b> {event.eventLocation}</p>
                <p className="text-gray-500 text-sm"><b>Created by:</b> {event.creator}</p>
                <div className="flex gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Close</button>
                    <button onClick={onUpdate} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Update</button>
                </div>
            </div>
        </div>
    );
}