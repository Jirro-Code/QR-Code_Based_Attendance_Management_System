import { register, logout, type RegisterPayload } from "../services/auth.ts";
import { createEvent, type Event } from "../services/events.ts";


export const useCreate = () => {
    
    type useRegisterProps = {
        path: string;
        form: RegisterPayload;
        setError: React.Dispatch<React.SetStateAction<string>>;
        setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
        setNotificationMessage: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    }
    
    type useCreateEventProps = {
        path: string;
        form: Event;
        setError: React.Dispatch<React.SetStateAction<string>>;
        setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
        setNotificationMessage: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    };
    
    const useRegister = async ({path, form, setError, setShowNotification, setNotificationMessage}: useRegisterProps) => {
        try {
            const response = await register(form);
            const data = await response.json();
            
            if (response.status === 400) {
                setError(data?.message ?? "Invalid registration data.");
            }
            if (response.status === 401) {
                await logout(path);
                setError(data?.message ?? "Unauthorized. Please log in.");
            }
            if (response.status === 403) {
                setError(data?.message ?? "Access denied. You do not have permission to perform this action.");
            }
            if (response.status === 409) {
                setError(data?.message ?? "User already exists.");
            }
            if (!response.ok) {
                setError(data?.message ?? "An error occurred during registration.");
            }
            setShowNotification(true);
            setNotificationMessage({
                title: "Registration Successful",
                message: `${data.user.username} have successfully registered.`,
            });
        }
        catch (e) {
            console.error("Error during registration:", e);
            setError("An error occurred during registration. Please try again.");
        }
    };
    
    const useCreateEvent = async ({form, path, setError, setShowNotification, setNotificationMessage}: useCreateEventProps) => {
        try {
            const response = await createEvent(form);
            const data = await response.json();
            if (response.status === 400) {
                setError(data?.message ?? "Invalid event data.");
            }
            if (response.status === 401) {
                await logout(path);
                setError(data?.message ?? "Unauthorized. Please log in.");
            }
            if (response.status === 403) {
                setError(data?.message ?? "Access denied. You do not have permission to perform this action.");
            }
            if (response.status === 409) {
                setError(data?.message ?? "Event already exists.");
            }
            if (!response.ok) {
                setError(data?.message ?? "An error occurred during event creation.");
            }
            setShowNotification(true);
            setNotificationMessage({
                title: "Event Created Successfully",
                message: `${data.event.eventName} have been created.`,
            });
        }
        catch (e) {
            console.error("Error during event creation:", e);
            setError("An error occurred during event creation. Please try again.");
        }
    }
    
    return { useRegister, useCreateEvent };
}
