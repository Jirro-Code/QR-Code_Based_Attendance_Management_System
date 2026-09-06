import { useState, useEffect } from "react"
import { useCreate } from "../../../hooks/useCreate.ts"
import { NotificationCard } from "../../../components/Cards/NotificationCard.tsx"
import { Header } from "../../../components/Header.tsx"
import { Input } from "../../../components/Input/Input.tsx"
import { type CreateEventData } from "../../../services/events.ts"

export const CreateEvent = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
    const [error, setError] = useState<string>("");
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<{ title: string; message: string}>({
        title: "",
        message: ""
    });
    const [eventData, setEventData] = useState<CreateEventData>({
        eventName: "",
        eventDescription: "",
        eventDate: "",
        eventLocation: "",
    })
    const {useCreateEvent} = useCreate();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEventData((current) => ({...current, [e.target.name]: e.target.value}))
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            if (eventData.eventName.trim().length < 2) {
                setError("Event name must be at least 2 characters long!");
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
            }
            if (eventData.eventLocation.trim().length < 2) {
                setError("Event location must be at least 2 characters long!");
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
            }
            await useCreateEvent({form: eventData, setError, setShowNotification, setNotificationMessage});
        } finally {
            setIsSubmitting(false);
        }
    }
    
    const reloadPage = () => {
        setEventData({
            eventName: "",
            eventDescription: "",
            eventDate: "",
            eventLocation: "",
        });
        setError("");
        setShowNotification(false);
    }
    
    const descriptionClassName = "mt-1 flex-1 w-full h-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-slate-400 focus:border-slate-400";
    
    return (
        <>
            <Header title="Create Event" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-full mx-auto pt-6 sm:pt-10 p-4 sm:p-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Create Event</h1>
                    {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                    
                    <form className="flex flex-col gap-3 sm:gap-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                            
                            <div className="flex flex-col gap-3 sm:w-1/2">
                                <Input label="Event Name" type="text" id="eventName" placeholder="Event Name" name="eventName" value={eventData.eventName} onChange={handleChange} error={error?.includes("name") ? error : undefined} />
                                <Input label="Event Location" type="text" id="eventLocation" placeholder="Event Location" name="eventLocation" value={eventData.eventLocation} onChange={handleChange} error={error?.includes("location") ? error : undefined} />
                                <Input label="Event Date" type="date" id="eventDate" placeholder="Event Date" name="eventDate" value={eventData.eventDate} onChange={handleChange} />
                            </div>
                            
                            <div className="flex flex-col sm:w-1/2 [&>div]:flex-1 [&>div]:flex [&>div]:flex-col [&>div]:mb-0">
                                <Input label="Event Description" type="textarea" id="eventDescription" placeholder="Event Description (Optional)" name="eventDescription" value={eventData.eventDescription} onChange={handleChange} isRequired={false} className={descriptionClassName} />
                            </div>
                        </div>
                        
                        <button type="submit" disabled={isSubmitting} className="bg-blue-800 hover:bg-blue-900 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded w-full sm:w-auto sm:min-w-40 self-center sm:self-end transition-colors duration-200">
                            {isSubmitting ? 'Creating...' : 'Create Event'}
                        </button>
                    </form>
                </div>
            </div>
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={reloadPage} />}
        </>
    )
}