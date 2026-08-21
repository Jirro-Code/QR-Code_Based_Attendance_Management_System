import { Header } from "../../components/Header.tsx";
import { SearchBar } from "../../components/SearchBar.tsx";
import { useView } from "../../hooks/useView.ts";
import { useEffect, useState } from "react";
import { type Event } from "../../services/events.ts";
import { EventAttendanceCard } from "../../components/Cards/EventAttendanceCard.tsx";
import { AttendanceCard } from "../../components/Cards/ViewCards/ViewAttendanceCard.tsx";
import { AttendanceFilterOptions } from "../../components/Filters/AttendanceFilter.tsx";
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
    const [showViewCard, setShowViewCard] = useState<boolean>(false);
    const [strand, setStrand] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<"A-Z" | "Z-A" | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedStrand, setSelectedStrand] = useState<string | null>(null);
    const [selectedByTime, setSelectedByTime] = useState<"latest" | "earliest" | null>(null);
    
    useEffect(() => {
        useViewAllEventsWithAttendanceRecords(setEventArray, setError);
    }, [setEventArray, setError]);
    
    const applyAllFilters = async (
        order: "A-Z" | "Z-A" | null,
        month: string | null,
        year: string | null,
        strandFilter: string | null,
        byTime: "latest" | "earliest" | null,
        query: string
    ) => {
        setError("");
        setStrand(null);
        
        let result: Event[] = [];
        await useViewAllEventsWithAttendanceRecords((allEvents: Event[]) => {
            result = [...allEvents];
        }, setError);
        
        if (strandFilter) {
            result = await useViewEventAttendanceByStrand(strandFilter, setError);
            setStrand(strandFilter);
        }
        
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
    };
    
    const handleApplyFilters = async (
        sortAlphabetical: "A-Z" | "Z-A" | null,
        month: string | null,
        year: string | null,
        strandFilter: string | null,
        byTime: "latest" | "earliest" | null
    ) => {
        setSelectedOrder(sortAlphabetical);
        setSelectedMonth(month);
        setSelectedYear(year);
        setSelectedStrand(strandFilter);
        setSelectedByTime(byTime);
        
        await applyAllFilters(sortAlphabetical, month, year, strandFilter, byTime, isOnSearch ? searchQuery : "");
    }; 
    
    const handleSearch = async () => {
        if (searchQuery.trim() === "") {
            setIsOnSearch(false);
            setSearchQuery("");
            await applyAllFilters(selectedOrder, selectedMonth, selectedYear, selectedStrand, selectedByTime, "");
            return;
        }
        
        setIsOnSearch(true);
        await applyAllFilters(selectedOrder, selectedMonth, selectedYear, selectedStrand, selectedByTime, searchQuery);
    };
    
    const handleClearSearch = async () => {
        setError("");
        setSearchQuery("");
        setIsOnSearch(false);
        setShowViewCard(false);
        await applyAllFilters(selectedOrder, selectedMonth, selectedYear, selectedStrand, selectedByTime, "");
    };
    
    const loadViewCard = (event: Event) => {
        setSelectedEvent(event);
        setShowViewCard(true);
    };
    
    
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
                                <EventAttendanceCard key={event.id} event={event} onView={() => loadViewCard(event)} />
                            ))
                        ) : (
                            <p>No events found.</p>
                        )}
                    </div>
                    
                    {showViewCard && selectedEvent && <AttendanceCard event={selectedEvent} strand={strand} onClose={() => setShowViewCard(false)} />}
                    {showFilter && (
                        <AttendanceFilterOptions
                            onClose={() => setShowFilter(false)}
                            onApplyFilters={handleApplyFilters}
                            selectedOrder={selectedOrder}
                            setSelectedOrder={setSelectedOrder}
                            selectedMonth={selectedMonth}
                            setSelectedMonth={setSelectedMonth}
                            selectedYear={selectedYear}
                            setSelectedYear={setSelectedYear}
                            selectedStrand={selectedStrand}
                            setSelectedStrand={setSelectedStrand}
                            selectedByTime={selectedByTime}
                            setSelectedByTime={setSelectedByTime}
                        />
                    )}
                </div>
            </div>
        </>
    )
}