import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useView } from "../../hooks/useView.ts";
import { type Event } from "../../services/events.ts";
import { Scanner } from "../../components/Scanner.tsx";
import { Header } from "../../components/Header.tsx";
import { Html5Qrcode, type CameraDevice } from "html5-qrcode";
import { Calendar, ScanLine } from "lucide-react";

export const ScannerPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
    const navigate = useNavigate();
    const { useViewAllEvents } = useView();
    const [error, setError] = useState<string>("");
    const [events, setEvents] = useState<Event[]>([]);
    const [eventId, setEventId] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState<boolean>(false);
    const [cameras, setCameras] = useState<CameraDevice[]>([]);
    
    useEffect(() => {
        useViewAllEvents(setEvents, setError);
    }, []);
    
    const availableEvents = events.filter((event) => {
        const localDateToday = Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
        return event.eventDate === localDateToday;
    });
    
    const handleStartScanner = async () => {
        try {
            setError("");
            const devices = await Html5Qrcode.getCameras();
            
            if (devices.length === 0) {
                setError("No camera was found.");
                return;
            }
            setCameras(devices);
            setShowScanner(true);
        }
        catch (err) {
            console.error("Error getting cameras:", err);
            setError("Unable to access the camera. Please allow camera permission.");
        }
    };
    
    const selectedEvent = events.find((event) => event.id === eventId);
    
    if (!eventId) {
        return (
            <>
                <Header title="Scanner" />
                <div className="min-h-screen bg-slate-100">
                    <div className="max-w-200 mx-auto pt-6 sm:pt-10 p-4 sm:p-6">
                        <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md flex flex-col gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Select Event</h2>
                                <p className="text-sm text-gray-500">Choose today's event to start scanning attendees.</p>
                            </div>
                            
                            {error && <p className="text-red-600 text-sm">{error}</p>}
                            
                            {availableEvents.length === 0 && (
                                <div className="flex flex-col items-center gap-2 py-8 text-center">
                                    <Calendar className="text-gray-300" size={36} />
                                    <p className="text-gray-500 text-sm">No events available for today.</p>
                                </div>
                            )}
                            
                            <div className="flex flex-col gap-2">
                                {availableEvents?.filter((event) => !event.isArchived).map((event) => (
                                    <button key={event.id} onClick={() => { setEventId(event.id); setError(""); }}
                                        className="group flex items-center gap-3 text-left border border-gray-200 hover:bg-gray-100 rounded-md py-3 px-4 transition-colors duration-200">
                                        <Calendar className="text-blue-800 shrink-0" size={18} />
                                        <span className="min-w-0 flex-1">
                                            <span className="block font-semibold text-gray-800 truncate">{event.eventName}</span>
                                            <span className="block text-xs text-gray-500">{event.eventDate}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                            
                            <button onClick={() => navigate("/admin-dashboard")} className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-colors duration-200">
                                Cancel
                            </button>
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
                <div className="max-w-200 mx-auto pt-6 sm:pt-10 p-4 sm:p-6">
                    <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md flex flex-col gap-4">
                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <div className="flex items-start gap-3 border border-gray-200 rounded-md py-3 px-4 bg-slate-50">
                            <Calendar className="text-blue-800 shrink-0 mt-0.5" size={18} />
                            <div className="min-w-0">
                                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Selected Event</p>
                                <p className="text-gray-800 font-semibold truncate">{selectedEvent?.eventName}</p>
                                <p className="text-xs text-gray-500">{selectedEvent?.eventDate}</p>
                            </div>
                        </div>

                        <button onClick={handleStartScanner} className="flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-bold py-2.5 px-4 rounded transition-colors duration-200">
                            <ScanLine size={18} />
                            Start Scanner
                        </button>

                        <button onClick={() => setEventId(null)} className="text-sm text-gray-500 hover:underline self-center">
                            Choose a different event
                        </button>
                    </div>
                </div>
            </div>
            {showScanner && <Scanner onClose={() => setShowScanner(false)} eventId={eventId} cameras={cameras} />}
        </>
    );
};