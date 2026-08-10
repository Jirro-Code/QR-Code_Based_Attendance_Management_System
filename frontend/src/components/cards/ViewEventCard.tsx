import { type Event } from "../../services/events";

type ViewEventCardProps = {
    event: Partial<Event>;
    onClose: () => void;
    onUpdate: () => void;
};

export const ViewEventCard = ({ event, onClose, onUpdate }: ViewEventCardProps) => {
    return (
        <div className="view-event-card">
            <p><b>Event Name:</b> {event.eventName}</p>
            <p><b>Description:</b> {event.eventDescription}</p>
            <p><b>Date:</b> {event.eventDate}</p>
            <p><b>Location:</b> {event.eventLocation}</p>
            <p><b>Created by:</b> {event.creator}</p>
            <button onClick={onClose}>Close</button>
            <button onClick={onUpdate}>Update</button>
        </div>
    );
}