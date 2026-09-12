import { Header } from "../../components/Header.tsx";
import { SearchBar } from "../../components/SearchBar.tsx";
import { useView } from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Event } from "../../services/events.ts";
import { ViewEventCard } from "../../components/Cards/ViewCards/ViewEventCard.tsx";
import { EventCard } from "../../components/Cards/EventCard.tsx";
import { EventFilterOptions } from "../../components/Filters/EventFilter.tsx";
import { Calendar } from "../../components/Calendar.tsx";
import { Ellipsis, CalendarDays } from "lucide-react";
import { Navbar } from "../../components/Navbar.tsx";

export const EventsPage = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
    const { useViewAllEvents, useSearchEvents } = useView();
    const [error, setError] = useState<string>("");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [eventArray, setEventArray] = useState<Event[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isOnSearch, setIsOnSearch] = useState<boolean>(false);
    const [showViewCard, setShowViewCard] = useState<boolean>(false);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<"A-Z" | "Z-A" | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedByTime, setSelectedByTime] = useState<"latest" | "earliest" | null>(null);
    
    const localDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                await useViewAllEvents((allEvents: Event[]) => {
                    const upcoming = allEvents.filter(
                        (event) => event.eventDate > localDateString(new Date())
                    );
                    setEventArray(upcoming);
                }, setError);
            }
            catch (error) {
                console.error("Error fetching events:", error);
                setError("Failed to fetch events.");
            }
        };
        fetchEvents();
    }, []);
    
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
            
            result = result.filter((event) => event.eventDate > localDateString(new Date()));
            
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
        setShowViewCard(false);
        setError("");
        await applyAllFilters(selectedOrder, selectedMonth, selectedYear, selectedByTime, "");
    }
    
    
    return(
        <>
            <Navbar dashPath="/student-dashboard" profilePath="/student/profile" />
            <Header title="Upcoming Events" path="/student-dashboard" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-full mx-auto p-6">
                    <SearchBar handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchQuery={searchQuery} handleClearSearch={handleClearSearch} isOnSearch={isOnSearch} handleFilterClick={() => setShowFilter(true)} />
                    {showCalendar && <Calendar isAdmin={false} onClose={() => setShowCalendar(false)} refreshEvents={eventArray} />}
                    <p className="text-red-600 text-sm">{error}</p>
                    
                    
                    <div className="mt-3 mb-3 flex items-center justify-between">
                        <button onClick={() => {showCalendar ? setShowCalendar(false) : setShowCalendar(true)}}>
                            <CalendarDays className="w-5 h-5" />
                        </button>
                        
                        {!isOnSearch &&
                            <button onClick={() => setShowFilter(true)}>
                                <Ellipsis className="w-5 h-5" />
                            </button>
                        }
                    </div>
                    
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-4">
                        {eventArray.filter((event) => event.isArchived === false).length > 0 ? (
                            eventArray.filter((event) => event.isArchived === false).map((event: Event) => (
                                <EventCard key={event.id} event={event} onLoadView={() => {setSelectedEvent(event), setShowViewCard(true)}} isOnArchivedPage={false} isAdmin={false} />
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
                    
                    {showViewCard && selectedEvent && <ViewEventCard event={selectedEvent}  onClose={() => setShowViewCard(false)} />}
                </div>
            </div>
        </>
    )
}
