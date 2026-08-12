import { register, logout, type RegisterPayload } from "../services/auth.ts";
import { createEvent, type CreateEventData } from "../services/events.ts";
import { markStudentPresent } from "../services/attendance.ts";
import { ApiError } from "../services/error.ts";

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
    
    type useMarkAttendanceProps = {
        uuid: string,
        eventId: string,
        isLate: boolean,
        setError: (message: string) => void
    };   

    const useRegister = async ({ form, setError, setShowNotification, setNotificationMessage}: useRegisterProps) => {
        try {
            const data = await register(form);
            setShowNotification(true);
            setNotificationMessage({
                title: "Registration Successful",
                message: `${data.user.username} have successfully registered.`,
            });
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid registration data.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status === 409) {
                    setError(e.message || "User already exists.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred during registration.");
            console.error("Error during registration:", e);
            throw e;
        }
    };
    
    const useCreateEvent = async ({form, setError, setShowNotification, setNotificationMessage}: useCreateEventProps) => {
        try {
            const data = await createEvent(form);
            setShowNotification(true);
            setNotificationMessage({
                title: "Event Created Successfully",
                message: `${data.event.eventName} have been created.`,
            });
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message || "Invalid event data.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 403) {
                    setError(e.message || "Access denied. You do not have permission to perform this action.");
                }
                if (e.status === 409) {
                    setError(e.message || "Event already exists.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            setError("An error occurred during event creation.");
            console.error("Error during event creation:", e);
            throw e;
        }
    }
    
    const useMarkAttendance = async ({uuid, eventId, isLate, setError}: useMarkAttendanceProps) => {
        try {
            const response = await markStudentPresent(uuid, eventId, isLate);
            return response;
        } 
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e.message ?? "Invalid attendance data.");
                }
                if (e.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout("/admin-login");
                }
                if (e.status === 403) {
                    setError(e.message ?? "Access denied. You do not have permission to perform this action.");
                }
                if (e.status === 404) {
                    setError(e.message ?? "Event not found or student not found.");;               
                }
                if (e.status === 409) {
                    alert("Attendance already marked.");
                    setError(e.message || "Attendance already marked.");
                    return { result: "already_marked" };
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            } 
            alert("Something went wrong. Please try again later.");
            setError("An error occurred during attendance marking.");
            console.error("Error during attendance marking:", e);
            throw e;
        }
    }
    
    return { useRegister, useCreateEvent, useMarkAttendance };
}
