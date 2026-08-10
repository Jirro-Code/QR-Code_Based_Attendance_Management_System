import { register, logout, type RegisterPayload } from "../services/auth.ts";
import { createEvent, type CreateEventData } from "../services/events.ts";


export const useCreate = () => {
    
    type useRegisterProps = {
        form: RegisterPayload;
        setError: React.Dispatch<React.SetStateAction<string>>;
        setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
        setNotificationMessage: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    }
    
    type useCreateEventProps = {
        form: CreateEventData;
        setError: React.Dispatch<React.SetStateAction<string>>;
        setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
        setNotificationMessage: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>;
    };
    
    const useRegister = async ({ form, setError, setShowNotification, setNotificationMessage}: useRegisterProps) => {
        try {
            const response = await register(form);
            const data = await response.json();
            
            if (response.status === 400) {
                setError(data?.message ?? "Invalid registration data.");
            }
            if (response.status === 401) {
                alert("Unauthorized. Please log in.");
                await logout("/admin-login");
            }
            if (response.status === 403) {
                setError(data?.message ?? "Access denied. You do not have permission to perform this action.");
            }
            if (response.status === 409) {
                setError(data?.message ?? "User already exists.");
            }
            if (!response.ok) {
                alert("Something went wrong. Please try again later.");
                setError(data?.message ?? "An error occurred during registration.");
            }
            setShowNotification(true);
            setNotificationMessage({
                title: "Registration Successful",
                message: `${data.user.username} have successfully registered.`,
            });
        }
        catch (e) {
            alert("Something went wrong. Please try again later.");
            console.error("Error during registration:", e);
        }
    };
    
    const useCreateEvent = async ({form, setError, setShowNotification, setNotificationMessage}: useCreateEventProps) => {
        try {
            const response = await createEvent(form);
            const data = await response.json();
            if (response.status === 400) {
                setError(data?.message ?? "Invalid event data.");
            }
            if (response.status === 401) {
                alert("Unauthorized. Please log in.");
                await logout("/admin-login");
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
            alert("Something went wrong. Please try again later.");
            console.error("Error during event creation:", e);
        }
    }
    
    return { useRegister, useCreateEvent };
}
