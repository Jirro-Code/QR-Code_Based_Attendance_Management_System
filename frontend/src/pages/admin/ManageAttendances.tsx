import { Header } from "../../components/Header.tsx";
import { SearchBar } from "../../components/SearchBar.tsx";
import { useView } from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Event } from "../../services/events.ts";
import { EventAttendanceCard } from "../../components/Cards/EventAttendanceCard.tsx";
import { UpdateEventCard } from "../../components/Cards/UpdateEventCard.tsx";
import { DeleteEventCard } from "../../components/Cards/DeleteEventCard.tsx";
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx";
import { AttendanceCard } from "../../components/Cards/ViewAttendanceCard.tsx";
import { FilterOptions } from "../../components/AttendanceFilter.tsx";
import { Ellipsis } from "lucide-react";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const ManageAttendances = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
    const { useViewAllEventsWithAttendanceRecords, useSearchEvents, useViewEventAttendanceByStrand } = useView();
    const [error, setError] = useState<string>("");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [eventArray, setEventArray] = useState<Event[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isOnSearch, setIsOnSearch] = useState<boolean>(false);
    const [showUpdateCard, setShowUpdateCard] = useState<boolean>(false);
    const [showDeleteCard, setShowDeleteCard] = useState<boolean>(false);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [showViewCard, setShowViewCard] = useState<boolean>(false);
    const [strand, setStrand] = useState<string | null>(null);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    
    useEffect(() => {
        useViewAllEventsWithAttendanceRecords(setEventArray, setError);
    }, [setEventArray, setError]);
    
    const handleApplyFilters = async ( sortAlphabetical: "A-Z" | "Z-A" | null, month: string | null, year: string | null, strand: string | null, byTime: "latest" | "earliest" | null ) => {
        await useViewAllEventsWithAttendanceRecords(async (allEvents: Event[]) => {
            setError("");
            setStrand(null);
            
            let result = [...allEvents];
            
            // Strand filter (fresh fetch, replaces base)
            if (strand) {
                result = await useViewEventAttendanceByStrand(strand, setError);
                setStrand(strand);
            }
            
            // Search filter (intersect with whatever result already has, e.g. strand)
            if (isOnSearch) {
                const searchedEvents = await useSearchEvents(searchQuery.trim(), setError);
                const searchedIds = new Set(searchedEvents.map((event) => event.id));
                result = result.filter((event) => searchedIds.has(event.id));
            }
            
            // Date filters
            if (month && year) {
                const monthIndex = MONTHS.indexOf(month);
                if (monthIndex === -1) {
                    result = [];
                } else {
                    const cutoffDate = new Date(Number(year), monthIndex + 1, 0);
                    cutoffDate.setHours(23, 59, 59, 999);
                    result = result.filter((event) => new Date(event.eventDate).getTime() <= cutoffDate.getTime());
                }
            } else if (month && !year) {
                const monthIndex = MONTHS.indexOf(month);
                result = result.filter((event) => new Date(event.eventDate).getMonth() === monthIndex);
            } else if (!month && year) {
                const cutoffDate = new Date(Number(year), 11, 31);
                cutoffDate.setHours(23, 59, 59, 999);
                result = result.filter((event) => new Date(event.eventDate).getTime() <= cutoffDate.getTime());
            }
            
            // Sorting (applied last so it governs final display order)
            if (sortAlphabetical) {
                result.sort((a, b) =>
                    sortAlphabetical === "A-Z"
                        ? a.eventName.localeCompare(b.eventName)
                        : b.eventName.localeCompare(a.eventName)
                );
            }
            
            if (byTime) {
                result.sort((a, b) =>
                    byTime === "latest"
                        ? new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
                        : new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
                );
            }
            
            setEventArray(result);
        }, setError);
    };
    
    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            setSearchQuery("");
            setError("");
            await useViewAllEventsWithAttendanceRecords(setEventArray, setError);
            setIsOnSearch(false);
            return;
        }
        
        setError("");
        const searchedEvents = await useSearchEvents(searchQuery.trim(), setError);
        
        await useViewAllEventsWithAttendanceRecords((allEvents: Event[]) => {
            const eventsWithAttendanceMap = new Map(allEvents.map((event) => [event.id, event]));
            
            const filteredEvents = searchedEvents
                .map((event) => eventsWithAttendanceMap.get(event.id))
                .filter(
                    (event): event is Event =>
                        !!event && !!event.id && event.id.length > 0
                );
            
            setEventArray(filteredEvents);
        }, setError);
        
        setIsOnSearch(true);
    };
    
    const handleClearSearch = async () => {
        setError("");
        setSearchQuery("");
        setIsOnSearch(false);
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(false);
        await useViewAllEventsWithAttendanceRecords(setEventArray, setError);
    }
    
    const refreshEventList = async () => {
        if (isOnSearch) {
            setError("");
            setShowUpdateCard(false);
            setShowDeleteCard(false);
            setShowViewCard(false);
            await handleSearch();
            return;
        }
        setError("");
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(false);
        setIsOnSearch(false);
        await useViewAllEventsWithAttendanceRecords(setEventArray, setError);
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
        await useViewAllEventsWithAttendanceRecords(setEventArray, setError);           
    }
    
    return(
        <>
            <Header title="Manage Attendances" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-5xl mx-auto p-6">
                    <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchQuery={searchQuery} isOnSearch={isOnSearch} handleClearSearch={handleClearSearch} handleFilterClick={() => setShowFilter(true)}/>
                    <p className="text-red-600 text-sm">{error}</p>
                    
                    {!isOnSearch && 
                        <div className="mt-3 mb-3 flex items-center justify-end">
                            <button onClick={() => setShowFilter(true)}>
                                <Ellipsis className="w-5 h-5" />
                            </button>
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
                    {showViewCard && selectedEvent && <AttendanceCard event={selectedEvent} strand={strand} onClose={() => setShowViewCard(false)} />}
                    {showDeleteCard && selectedEvent && <DeleteEventCard id={selectedEvent.id} onDeleted={refreshEventList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} />}
                    {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
                    {showFilter && <FilterOptions onClose={() => setShowFilter(false)} onApplyFilters={handleApplyFilters} />}
                </div>
            </div>
        </>
    )
}