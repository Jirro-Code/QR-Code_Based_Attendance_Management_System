import { type Event } from "../../services/events.ts";
import { Eye, Trash2 } from "lucide-react"

export const EventAttendanceCard = ({ event, onView, onDelete }: { event: Event; onView: (event: Event) => void; onDelete: (event: Event) => void }) => {
    return(
        <div className="card min-h-20 w-full rounded-md overflow-hidden shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
            <div className="h-1/2 bg-blue-800 p-3 flex items-center">
                <h2 className="text-white text-lg font-bold">{event.eventName}</h2>
            </div>
            
            <div className="h-2/4 flex justify-end items-center p-3">
                <button onClick={() => onView(event)} className="p-3 text-blue-800">
                    <Eye size={20} />
                </button>
                <button onClick={() => onDelete(event)} className="p-3 text-red-500">
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    )
}