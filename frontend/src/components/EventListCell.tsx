import { type Event } from "../services/events";

function EventListCell({ event, onUpdate, onLoadUpdate, onDelete, onLoadDelete}: {  event: Event, onUpdate: () => void, onDelete: () => void, onLoadUpdate: () => void, onLoadDelete: () => void }) {
    
    function handleUpdate() {
        onUpdate();
        onLoadUpdate();
    }
    function handleDelete() {
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

export default EventListCell;