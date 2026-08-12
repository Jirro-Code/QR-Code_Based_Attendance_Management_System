import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useView } from "../../hooks/useView.ts";
import { type Event } from "../../services/events.ts";
import { Scanner } from "../../components/Scanner.tsx";
import { BackButton } from "../../components/Button/Button.tsx";

export const ScannerPage = () => {
    const navigate = useNavigate();
    const { useViewAllEvents } = useView();
    const [error, setError] = useState<string>("");
    const [events, setEvents] = useState<Event[]>([]);
    const [eventId, setEventId] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState<boolean>(false);
    
    useEffect(() => {
        useViewAllEvents(setEvents, setError);
    }, []);
    
    const availableEvents = events.filter((event) => {
        const localDateToday = Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
        return event.eventDate === localDateToday;
    });
    
    if (!eventId) {
        return (
            <div>
                <h2>Select Event</h2>
                {error && <p>{error}</p>}
                {availableEvents.length === 0 && (<p>No events available for today or the future.</p>)}
                
                {availableEvents?.map((event) => (
                    <button key={event.id} onClick={() => {setEventId(event.id), setError(""); }}>{event.eventName} - {event.eventDate}</button>
                ))}
                <button onClick={() => navigate("/admin-dashboard")}>Cancel</button>
            </div>
        );
    }
    
    return (
        <div>
            <h2>Scanner</h2>
            <BackButton path="/admin-dashboard" />
            {error && <p>{error}</p>}
            <p>Selected Event: {events.find((event) => event.id === eventId)?.eventName} - {events.find((event) => event.id === eventId)?.eventDate}</p>
            <button onClick={() => setShowScanner(true)}>Start Scanner</button>
            {showScanner && <Scanner onClose={() => setShowScanner(false)} eventId={eventId} />}
        </div>
    );
};