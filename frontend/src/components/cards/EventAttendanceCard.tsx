import { type Event } from "../../services/events.ts";
import { Trash2 } from "lucide-react"

export const EventAttendanceCard = ({ event, onView, onDelete }: { event: Event; onView: (event: Event) => void; onDelete: (event: Event) => void }) => {
    return(
        <div onClick={() => onView(event)} className="group relative w-full pt-3 cursor-pointer transition duration-200 hover:-translate-y-1">
            
            <div className="absolute left-0 top-0 h-5 w-25 rounded-t-md bg-blue-700 transition-colors duration-200 group-hover:bg-blue-800"
                style={{ clipPath: "polygon(0 0, 81% 0, 100% 100%, 0 100%)" }}
            />
            <div className="absolute z-2 left-0 top-3 h-3 w-23 rounded-tl-sm bg-blue-700 transition-colors duration-200 group-hover:bg-blue-800 rotate-180"
                style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" }}
            />
            
            <div className="card relative w-full overflow-hidden rounded-md rounded-tl-none bg-white shadow-sm transition duration-200 group-hover:shadow-xl">
                
                <div className="flex min-h-12 items-center bg-blue-800 p-3 transition-colors duration-200 group-hover:bg-blue-900">
                    <h3 className="text-[16px] font-bold mt-1 text-white">{event.eventName}</h3>
                </div>
                
                <div className="flex items-center justify-end gap-1 p-3">
                    <button onClick={() => onDelete(event)} className="rounded-md p-2 text-red-500 transition-colors hover:bg-red-50">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}