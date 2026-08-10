import { BackButton } from "../../../components/Button/Button.tsx";
import { SearchBar } from "../../../components/SearchBar.tsx";
import { useView } from "../../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Event } from "../../../services/events.ts";
import { EventCard } from "../../../components/Cards/EventCard/EventCard.tsx";
import { UpdateEventCard } from "../../../components/Cards/UpdateEventCard.tsx";
import { DeleteEventCard } from "../../../components/Cards/DeleteEventCard.tsx";
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx";
import styles from "./ManageEvents.module.css";

export const ManageEvents = () => {
    const { useViewAllEvents, useSearchEvents } = useView();
    const [eventArray, setEventArray] = useState<Event[]>([]);
    const [error, setError] = useState<string>("");
    const [isOnSearch, setIsOnSearch] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showUpdateCard, setShowUpdateCard] = useState<boolean>(false);
    const [showDeleteCard, setShowDeleteCard] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    
    useEffect(() => {
        useViewAllEvents(setEventArray);
    }, [setEventArray]);
    
    const refreshEventList = async () => {
        if (isOnSearch) {
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            await handleSearch();
        }
        else {
            setShowNotification(true);
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            setIsOnSearch(false);
            await useViewAllEvents(setEventArray);
        }
    }
    
    const handleSearch = async () => {
            if (searchQuery.trim() === "") {
                await useViewAllEvents(setEventArray);
                setIsOnSearch(false);
                setSearchQuery("");
                return;
            }
            
            const searchedEvents = await useSearchEvents(searchQuery.trim(), setError);
            setEventArray(searchedEvents);
            setIsOnSearch(true);
        };
    
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
                        <EventCard key={event.eventName} event={event} onUpdate={() => {setSelectedEvent(event), setShowDeleteCard(false), setShowNotification(false)}} onDelete={() => {setSelectedEvent(event), setShowUpdateCard(false), setShowNotification(false);}} onLoadUpdate={() => {setShowUpdateCard(true)}} onLoadDelete={() => {setShowDeleteCard(true)}} />
                    ))
                ) : (
                    <p>No events found.</p>
                )}
            </div>
            {showUpdateCard && selectedEvent && <UpdateEventCard eventId={selectedEvent.eventId} onUpdated={refreshEventList}  onSetNotif={setNotificationMessage}  />}            
            {showDeleteCard && selectedEvent && <DeleteEventCard eventId={selectedEvent.eventId} onDeleted={refreshEventList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} />}
            
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
            
        </div>
    )
}