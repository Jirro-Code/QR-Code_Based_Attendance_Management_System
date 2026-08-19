import { Header } from "../../components/Header.tsx";
import { SearchBar } from "../../components/SearchBar.tsx";
import { useView } from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Event } from "../../services/events.ts";
import { EventAttendanceCard } from "../../components/Cards/EventAttendanceCard.tsx";
import { UpdateEventCard } from "../../components/Cards/UpdateEventCard.tsx";
import { DeleteEventCard } from "../../components/Cards/DeleteEventCard.tsx";
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx";
import { AttendanceCard } from "../../components/Cards/AttendanceCard.tsx";
import { Ellipsis } from "lucide-react";

export const ManageAttendances = () => {
    window.scrollTo({ top: 0, left: 0 });
    const { useViewAllEvents, useSearchEvents } = useView();
    const [error, setError] = useState<string>("");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [eventArray, setEventArray] = useState<Event[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isOnSearch, setIsOnSearch] = useState<boolean>(false);
    const [showUpdateCard, setShowUpdateCard] = useState<boolean>(false);
    const [showDeleteCard, setShowDeleteCard] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [showViewCard, setShowViewCard] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    
    useEffect(() => {
        useViewAllEvents(setEventArray, setError);
    }, [setEventArray, setError]);
    
    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            setSearchQuery("");
            setError("");
            await useViewAllEvents(setEventArray, setError);
            setIsOnSearch(false);
            return;
        }
        
        const searchedEvents = await useSearchEvents(searchQuery.trim(), setError);
        setEventArray(searchedEvents);
        setIsOnSearch(true);
    };
    
    const handleClearSearch = async () => {
        setSearchQuery("");
        setIsOnSearch(false);
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(false);
        setError("");
        await useViewAllEvents(setEventArray, setError);
        setIsOnSearch(false);
    }
    
    const refreshEventList = async () => {
        if (isOnSearch) {
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            setShowViewCard(false);
            setError("");
            await handleSearch();
            return;
        }
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(false);
        setError("");
        setIsOnSearch(false);
        await useViewAllEvents(setEventArray, setError);
    };
    
    const loadViewCard = (event: Event) => {
        setSelectedEvent(event);
        setShowViewCard(true);
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowNotification(false);
    };
    
    const loadDeleteCard = (event: Event) => {
        setSelectedEvent(event);
        setShowDeleteCard(true);
        setShowUpdateCard(false);
        setShowViewCard(false);
        setShowNotification(false);
    };
    
    const updateNotification = async (updatedEvent: Event) => {
        if (isOnSearch) {
            setSelectedEvent(updatedEvent);
            setEventArray((prevEvents) => prevEvents.map((event) => event.id === updatedEvent.id ? updatedEvent : event));
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            setShowViewCard(true);
            setShowNotification(true);  
            await handleSearch();
            return;
        }
        setSelectedEvent(updatedEvent);
        setEventArray((prevEvents) => prevEvents.map((event) => event.id === updatedEvent.id ? updatedEvent : event));
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(true);
        setShowNotification(true);  
        await useViewAllEvents(setEventArray, setError);           
    }
    
    return(
        <>
            <Header title="Manage Attendances" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-5xl mx-auto p-6">
                    <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchQuery={searchQuery} isOnSearch={isOnSearch} handleClearSearch={handleClearSearch} />
                    <p className="text-red-600 text-sm">{error}</p>
                    
                    {!isOnSearch && 
                        <div className="mt-3 mb-3 flex items-center justify-end">
                            <button ><Ellipsis className="w-5 h-5" /></button>
                        </div>
                    }
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
                        {eventArray.length > 0 ? (
                            eventArray.map((event: Event) => (
                                <EventAttendanceCard key={event.id} event={event} onView={() => loadViewCard(event)} onDelete={() => loadDeleteCard(event)}  />
                            ))
                        ) : (
                            <p>No events found.</p>
                        )}
                    </div>
                    
                    {showUpdateCard && selectedEvent && <UpdateEventCard id={selectedEvent.id} onUpdated={(updatedEvent) => updateNotification(updatedEvent)} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowUpdateCard(false)} />}      
                    {showViewCard && selectedEvent && <AttendanceCard event={selectedEvent} onClose={() => setShowViewCard(false)} />}
                    {showDeleteCard && selectedEvent && <DeleteEventCard id={selectedEvent.id} onDeleted={refreshEventList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} />}
                    {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
                </div>
            </div>
        </>
    )
}