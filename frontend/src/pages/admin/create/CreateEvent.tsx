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
    
    return (
        <>
            <Header title="Create Event" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-md mx-auto pt-10 p-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Event</h1>
                        <p className="text-red-600 text-sm">{error}</p>
                        
                        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                            <Input label="Event Name" type="text" id="eventName" placeholder="Event Name" name="eventName" value={eventData.eventName} onChange={handleChange} error={error?.includes("name") ? error : undefined} />
                            <Input label="Event Description" type="text" id="eventDescription" placeholder="Event Description (Optional)" name="eventDescription" value={eventData.eventDescription} onChange={handleChange} isRequired={false} />
                            <Input label="Event Date" type="date" id="eventDate" placeholder="Event Date" name="eventDate" value={eventData.eventDate} onChange={handleChange} />
                            <Input label="Event Location" type="text" id="eventLocation" placeholder="Event Location" name="eventLocation" value={eventData.eventLocation} onChange={handleChange} error={error?.includes("location") ? error : undefined} />
                            <button type="submit" disabled={isSubmitting} className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mt-2">
                                {isSubmitting ? 'Creating...' : 'Create Event'}
                            </button>
                        </form>
                        
                        {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={reloadPage} />}
                    </div>
                </div>
            </div>
        </>
    )
}