import { BackButton } from "../../../components/Button/Button.tsx";
import { SearchBar } from "../../../components/SearchBar.tsx";
import { useView } from "../../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Event } from "../../../services/events.ts";
import { EventCard } from "../../../components/Cards/EventCard/EventCard.tsx";
import { UpdateEventCard } from "../../../components/Cards/UpdateEventCard.tsx";
import { DeleteEventCard } from "../../../components/Cards/DeleteEventCard.tsx";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";
import { ViewEventCard } from "../../../components/Cards/ViewEventCard.tsx";
import styles from "./ManageEvents.module.css";

export const ManageEvents = () => {
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
            await useViewAllEvents(setEventArray, setError);
            return;
        }
        
        const searchedEvents = await useSearchEvents(searchQuery.trim(), setError);
        setEventArray(searchedEvents);
        setIsOnSearch(true);
    };
    
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
    }
    
    const loadUpdateCard = (event: Event) => {
        setSelectedEvent(event);
        setShowUpdateCard(true);
        setShowDeleteCard(false);
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
        <div className={styles.manageEventsPage}>
            <h1>Manage Events</h1>
            <p>This is the Manage Events page.</p>
            <BackButton path="/admin-dashboard" />
            <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
            <p>{error}</p>
            <div className={styles.eventCardContainer}>
                {eventArray.length > 0 ? (
                    eventArray.map((event: Event) => (
                        <EventCard key={event.eventName} event={event} onDelete={() => loadDeleteCard(event)} onLoadView={() => loadViewCard(event)} />
                    ))
                ) : (
                    <p>No events found.</p>
                )}
            </div>
            {showUpdateCard && selectedEvent && <UpdateEventCard id={selectedEvent.id} onUpdated={(updatedEvent) => updateNotification(updatedEvent)} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowUpdateCard(false)} />}            
            {showDeleteCard && selectedEvent && <DeleteEventCard id={selectedEvent.id} onDeleted={refreshEventList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} />}
            {showViewCard && selectedEvent && <ViewEventCard event={selectedEvent}  onUpdate={() => loadUpdateCard(selectedEvent)} onClose={() => {setShowViewCard(false), setShowUpdateCard(false), setShowNotification(false)}} />}
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
            
        </div>
    )
}