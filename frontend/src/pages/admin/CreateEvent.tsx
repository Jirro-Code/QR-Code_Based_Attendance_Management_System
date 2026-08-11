import { useState } from "react"
import { useCreate } from "../../hooks/useCreate.ts"
import { NotificationCard } from "../../components/Cards/NotificationCard.tsx"
import { BackButton } from "../../components/Button/Button.tsx"
import { Input } from "../../components/Input/Input.tsx"
import { type CreateEventData } from "../../services/events.ts"

export const CreateEvent = () => {
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
        <div>
            <h1>Create Event</h1>
            <p>This is the Create Event page.</p>
            <p>{error}</p>
            <div className="backButton"><BackButton path="/admin-dashboard" /></div>
            <form className="createEventForm" onSubmit={handleSubmit}>
                <Input label="Event Name" type="text" id="eventName" placeholder="Event Name" name="eventName" value={eventData.eventName} onChange={handleChange} />
                <Input label="Event Description" type="text" id="eventDescription" placeholder="Event Description (Optional)" name="eventDescription" value={eventData.eventDescription} onChange={handleChange} isRequired={false} />
                <Input label="Event Date" type="date" id="eventDate" placeholder="Event Date" name="eventDate" value={eventData.eventDate} onChange={handleChange} />
                <Input label="Event Location" type="text" id="eventLocation" placeholder="Event Location" name="eventLocation" value={eventData.eventLocation} onChange={handleChange} />
                <button type="submit">Create Event</button>
            </form>
            {showNotification && <NotificationCard title={notificationMessage.title} message={notificationMessage.message} onClose={reloadPage} />}
        </div>
    )
}