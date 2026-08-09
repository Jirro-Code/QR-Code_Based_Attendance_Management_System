import { BackButton } from "../../components/Button/Button.tsx";
import { SearchBar } from "../../components/SearchBar.tsx";
import { useView } from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Event } from "../../services/events.ts";
import { EventListCell } from "../../components/EventListCell.tsx";

export const ManageEvents = () => {
    const [eventArray, setEventArray] = useState<Event[]>([]);
    const { useViewAllEvents } = useView();
    
    useEffect(() => {
        useViewAllEvents(setEventArray);
    }, [setEventArray]);
    
    return(
        <div className="manageEventsPage">
            <h1>Manage Events</h1>
            <p>This is the Manage Events page.</p>
            <BackButton path="/admin-dashboard" />
            <SearchBar handleSearch={() => {}} setSearchQuery={() => {}} />
            <p></p>
            {eventArray.length > 0 ? (
                eventArray.map((event: Event) => (
                    <EventListCell key={event.eventName} event={event} onUpdate={() => {}} onDelete={() => {}} onLoadUpdate={() => {}} onLoadDelete={() => {}} />
                ))
            ) : (
                <p>No events found.</p>
            )}
        </div>
    )
}