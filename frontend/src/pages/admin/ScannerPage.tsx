import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useView } from "../../hooks/useView.ts";
import { type Event } from "../../services/events.ts";
import { Scanner } from "../../components/Scanner.tsx";
import { Header } from "../../components/Header.tsx";
import { useScrollToTop } from "../../hooks/useScrollToTop.ts";

export const ScannerPage = () => {
    const { useScrollToTopPage } = useScrollToTop();
    useScrollToTopPage("/scanner");
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
            <>
                <Header title="Scanner" />
                <div className="min-h-screen bg-slate-100">
                    <div className="max-w-md mx-auto pt-10 p-6">
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-3">
                            <h2 className="text-lg font-semibold text-gray-800">Select Event</h2>
                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            {availableEvents.length === 0 && (<p className="text-gray-500 text-sm">No events available for today or the future.</p>)}
                            
                            {availableEvents?.map((event) => (
                                <button key={event.id} onClick={() => {setEventId(event.id), setError(""); }} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">{event.eventName} - {event.eventDate}</button>
                            ))}
                            <button onClick={() => navigate("/admin-dashboard")} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    
    return (
        <>
            <Header title="Scanner" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-md mx-auto pt-10 p-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-3">
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <p className="text-gray-700">Selected Event: {events.find((event) => event.id === eventId)?.eventName} - {events.find((event) => event.id === eventId)?.eventDate}</p>
                        <button onClick={() => setShowScanner(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Start Scanner</button>
                        {showScanner && <Scanner onClose={() => setShowScanner(false)} eventId={eventId} />}
                    </div>
                </div>
            </div>
        </>
    );
};