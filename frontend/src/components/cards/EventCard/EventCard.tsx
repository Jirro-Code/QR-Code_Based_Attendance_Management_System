import { type Event } from "../../../services/events";
import styles from "./EventCard.module.css";

type EventListCellProps = {
    event: Event;
    onUpdate: () => void;
    onLoadUpdate: () => void;
    onDelete: () => void;
    onLoadDelete: () => void;
};

export const EventCard = ({ event, onUpdate, onLoadUpdate, onDelete, onLoadDelete }: EventListCellProps) => {
    
    const handleUpdate = () => {
        onUpdate();
        onLoadUpdate();
    }
    const handleDelete = () => {
        onDelete();
        onLoadDelete();
    }
    
    return (
        <div className={styles.eventCard}>
            <p><b>Event Name:</b> {event.eventName}</p>
            <p><b>Description:</b> {event.eventDescription || "No description provided"}</p>
            <p><b>Date:</b> {event.eventDate}</p>
            <p><b>Location:</b> {event.eventLocation}</p>
            <p><b>Created by:</b> {event.creator}</p>
            <div className={styles.buttonContainer}>
                <button onClick={handleUpdate}>Update</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
            <div className={styles.viewButtonContainer}>
                <button>View</button>
            </div>
        </div>
    );
}