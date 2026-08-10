import { type Event } from "../../../services/events";
import styles from "./EventCard.module.css";

type EventListCellProps = {
    event: Partial<Event>;
    onDelete: () => void;
    onLoadView: () => void;
};

export const EventCard = ({ event, onDelete, onLoadView }: EventListCellProps) => {
    return (
        <div className={styles.eventCard}>
            <p><b>Event Name:</b> {event.eventName}</p>
            <p><b>Date:</b> {event.eventDate}</p>
            <div className={styles.buttonContainer}>
                <button onClick={onDelete}>Delete</button>
            </div>
            <div className={styles.viewButtonContainer}>
                <button onClick={onLoadView}>View</button>
            </div>
        </div>
    );
}