import {BackButton} from "../../components/Button/Button.tsx";
import SearchBar from "../../components/SearchBar";
import useViewUsers from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Event } from "../../services/events";
import EventListCell from "../../components/EventListCell.tsx";

function ManageEvents() {
    const [eventArray, setEventArray] = useState<Event[]>([]);
    const { viewAllEvents } = useViewUsers();

    useEffect(() => {
        viewAllEvents(setEventArray);
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
                    <EventListCell key={event.eventId} event={event} onUpdate={() => {}} onDelete={() => {}} onLoadUpdate={() => {}} onLoadDelete={() => {}} />
                ))
            ) : (
                <p>No events found.</p>
            )}
        </div>
    )
}


export default ManageEvents;