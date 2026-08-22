import { type Event } from "../../services/events";

type EventListCellProps = {
    event: Partial<Event>;
    onDelete: () => void;
    onLoadView: () => void;
};

export const EventCard = ({ event, onDelete, onLoadView }: EventListCellProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    
    return (
        <div className="inline-flex flex-col border border-gray-300 rounded-md p-4 m-2 shadow-md bg-white">
            <p className="flex"><b className="whitespace-nowrap  mr-1">Event Name:</b> <p className="overflow-hidden text-ellipsis whitespace-nowrap">{event.eventName}</p></p>
            <p><b>Date:</b> {formatDate(event.eventDate!)}</p>
            <div className="flex gap-2 mt-4">
                <button onClick={onDelete} className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded">
                    Delete
                </button>
                <button onClick={onLoadView} className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded">
                    View
                </button>
            </div>
        </div>
    );
}