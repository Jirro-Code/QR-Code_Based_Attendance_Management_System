import { type Event } from "../../services/events";

type EventListCellProps = {
    event: Partial<Event>;
    onDelete: () => void;
    onLoadView: () => void;
};

export const EventCard = ({ event, onDelete, onLoadView }: EventListCellProps) => {
    return (
        <div className="inline-flex flex-col border border-gray-300 rounded-md p-4 m-2 shadow-md bg-white">
            <p><b>Event Name:</b> {event.eventName}</p>
            <p><b>Date:</b> {event.eventDate}</p>
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