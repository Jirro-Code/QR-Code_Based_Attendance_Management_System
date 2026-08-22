import { Header } from "../../components/Header.tsx";
import { SearchBar } from "../../components/SearchBar.tsx";
import { useView } from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Event } from "../../services/events.ts";
import { EventCard } from "../../components/Cards/EventCard.tsx";
import { UpdateEventCard } from "../../components/Cards/UpdateCards/UpdateEventCard.tsx";
import { DeleteEventCard } from "../../components/Cards/DeleteCards/DeleteEventCard.tsx";
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx";
import { ViewEventCard } from "../../components/Cards/ViewCards/ViewEventCard.tsx";
import { EventFilterOptions } from "../../components/Filters/EventFilter.tsx";
import { Ellipsis } from "lucide-react";


export const ManageEvents = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
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
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<"A-Z" | "Z-A" | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedByTime, setSelectedByTime] = useState<"latest" | "earliest" | null>(null);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    
    useEffect(() => {
        useViewAllEvents(setEventArray, setError);
    }, [setEventArray, setError]);
    
    const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const parseYMD = (dateStr: string) => {
        const [year, month, day] = dateStr.split("-").map(Number);
        return { year, monthIndex: month - 1, day };
    };
    
    const applyAllFilters = async ( order: "A-Z" | "Z-A" | null,  month: string | null,  year: string | null, byTime: "latest" | "earliest" | null, query: string ) => {
        await useViewAllEvents(async (allEvents: Event[]) => {
            setError("");
            
            let result = [...allEvents];
            
            if (query.trim() !== "") {
                const searchedEvents = await useSearchEvents(query.trim(), setError);
                const searchedIds = new Set(searchedEvents.map((event) => event.id));
                result = result.filter((event) => searchedIds.has(event.id));
            }
            
            if (month && year) {
                const monthIndex = MONTHS.indexOf(month);
                if (monthIndex === -1) {
                    result = [];
                } else {
                    result = result.filter((event) => {
                        const { year: eYear, monthIndex: eMonthIndex } = parseYMD(event.eventDate);
                        return eYear === Number(year) && eMonthIndex === monthIndex;
                    });
                }
            } else if (month && !year) {
                const monthIndex = MONTHS.indexOf(month);
                result = result.filter((event) => parseYMD(event.eventDate).monthIndex === monthIndex);
            } else if (!month && year) {
                result = result.filter((event) => parseYMD(event.eventDate).year === Number(year));
            }
            
            if (order) {
                result.sort((a, b) =>
                    order === "A-Z"
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
    
    const handleApplyFilters = async (
        sortAlphabetical: "A-Z" | "Z-A" | null,
        month: string | null,
        year: string | null,
        byTime: "latest" | "earliest" | null
    ) => {
        setSelectedOrder(sortAlphabetical);
        setSelectedMonth(month);
        setSelectedYear(year);
        setSelectedByTime(byTime);
        
        await applyAllFilters(sortAlphabetical, month, year, byTime, isOnSearch ? searchQuery : "");
    };
    
    
    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            setIsOnSearch(false);
            setSearchQuery("");
            await applyAllFilters(selectedOrder, selectedMonth, selectedYear, selectedByTime, "");
            return;
        }
        
        setIsOnSearch(true);
        await applyAllFilters(selectedOrder, selectedMonth, selectedYear, selectedByTime, searchQuery);
    };
    
    const handleClearSearch = async () => {
        setSearchQuery("");
        setIsOnSearch(false);
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(false);
        setError("");
        await applyAllFilters(selectedOrder, selectedMonth, selectedYear, selectedByTime, "");
    }
    
    const refreshEventList = async () => {
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(false);
        setError("");
        await applyAllFilters(selectedOrder, selectedMonth, selectedYear, selectedByTime, isOnSearch ? searchQuery : "");
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
        setSelectedEvent(updatedEvent);
        setEventArray((prevEvents) => prevEvents.map((event) => event.id === updatedEvent.id ? updatedEvent : event));
        setShowUpdateCard(false);
        setShowDeleteCard(false);
        setShowViewCard(true);
        setShowNotification(true);
        await applyAllFilters(selectedOrder, selectedMonth, selectedYear, selectedByTime, isOnSearch ? searchQuery : "");
    }
    
    return(
        <>
            <Header title="Manage Events" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-5xl mx-auto p-6">
                    <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchQuery={searchQuery} handleClearSearch={handleClearSearch} isOnSearch={isOnSearch} handleFilterClick={() => setShowFilter(true)} />
                    <p className="text-red-600 text-sm">{error}</p>
                    
                    {!isOnSearch &&
                        <div className="mt-3 mb-3 flex items-center justify-end">
                            <button onClick={() => setShowFilter(true)}>
                                <Ellipsis className="w-5 h-5" />
                            </button>
                        </div>
                    }
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {eventArray.length > 0 ? (
                            eventArray.map((event: Event) => (
                                <EventCard key={event.id} event={event} onDelete={() => loadDeleteCard(event)} onLoadView={() => loadViewCard(event)} />
                            ))
                        ) : (
                            <p>No events found.</p>
                        )}
                    </div>
                    {showFilter && (
                        <EventFilterOptions
                            onClose={() => setShowFilter(false)}
                            onApplyFilters={handleApplyFilters}
                            selectedOrder={selectedOrder}
                            setSelectedOrder={setSelectedOrder}
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            selectedByTime={selectedByTime}
                            setSelectedByTime={setSelectedByTime}
                        />
                    )}
                    {showUpdateCard && selectedEvent && <UpdateEventCard id={selectedEvent.id} onUpdated={(updatedEvent) => updateNotification(updatedEvent)} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowUpdateCard(false)} />}
                    {showDeleteCard && selectedEvent && <DeleteEventCard id={selectedEvent.id} onDeleted={refreshEventList} setShowNotification={setShowNotification} onSetNotif={setNotificationMessage} onClose={() => setShowDeleteCard(false)} eventName={selectedEvent.eventName} />}
                    {showViewCard && selectedEvent && <ViewEventCard event={selectedEvent}  onUpdate={() => loadUpdateCard(selectedEvent)} onClose={() => {setShowViewCard(false), setShowUpdateCard(false), setShowNotification(false)}} />}
                    {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={() => setShowNotification(false)} />}
                </div>
            </div>
        </>
    )
}
