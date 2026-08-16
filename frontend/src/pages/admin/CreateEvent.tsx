import { useState } from "react"
import { useCreate } from "../../hooks/useCreate.ts"
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx"
import { Header } from "../../components/Header.tsx"
import { Input } from "../../components/Input/Input.tsx"
import { type CreateEventData } from "../../services/events.ts"

export const CreateEvent = () => {
    window.scrollTo({ top: 0, left: 0 });
    const [error, setError] = useState<string>("");
    const [showNotification, setShowNotification] = useState<boolean>(false);
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
        await useCreateEvent({form: eventData, setError, setShowNotification, setNotificationMessage});
    }
    
    const reloadPage = () => {
        setEventData({
            eventName: "",
            eventDescription: "",
            eventDate: "",
            eventLocation: "",
        });
        setShowNotification(false);
    }
    
    return (
        <>
            <Header title="Create Event" />
            <div className="min-h-screen bg-slate-100">
                <div className="max-w-md mx-auto pt-10 p-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        
                        <h1 className="text-2xl font-bold text-gray-800">Create Event</h1>
                        <p className="text-gray-600 mb-2">This is the Create Event page.</p>
                        <p className="text-red-600 text-sm">{error}</p>
                        
                        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
                            <Input label="Event Name" type="text" id="eventName" placeholder="Event Name" name="eventName" value={eventData.eventName} onChange={handleChange} />
                            <Input label="Event Description" type="text" id="eventDescription" placeholder="Event Description (Optional)" name="eventDescription" value={eventData.eventDescription} onChange={handleChange} isRequired={false} />
                            <Input label="Event Date" type="date" id="eventDate" placeholder="Event Date" name="eventDate" value={eventData.eventDate} onChange={handleChange} />
                            <Input label="Event Location" type="text" id="eventLocation" placeholder="Event Location" name="eventLocation" value={eventData.eventLocation} onChange={handleChange} />
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2">Create Event</button>
                        </form>
                        
                        {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={reloadPage} />}
                    </div>
                </div>
            </div>
        </>
    )
}