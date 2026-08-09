import { type Event } from "../services/events";

type EventListCellProps = {
    event: Event;
    onUpdate: () => void;
    onLoadUpdate: () => void;
    onDelete: () => void;
    onLoadDelete: () => void;
};

export const EventListCell = ({ event, onUpdate, onLoadUpdate, onDelete, onLoadDelete }: EventListCellProps) => {
    
    const handleUpdate = () => {
        onUpdate();
        onLoadUpdate();
    }
    const handleDelete = () => {
        onDelete();
        onLoadDelete();
    }
    
    return (
        <div className="list-cell">
            <p><b>Event Name:</b> {event.eventName}, <b>Date:</b> {event.eventDate}, <b>Location:</b> {event.eventLocation}</p>
            <button onClick={handleUpdate}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}