import { register, logout, type RegisterPayload } from "../services/auth.ts";

function useRegister<T extends RegisterPayload>(path: string, form: T, setError: React.Dispatch<React.SetStateAction<string>>, setShowNotification: React.Dispatch<React.SetStateAction<boolean>>, setNotificationMessage: React.Dispatch<React.SetStateAction<{ title: string; message: string}>>) {
    const handleRegister = async () => {
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
                message: `${data.user!.username} have successfully registered.`,
            });
        }
        catch (e) {
            console.error("Error during registration:", e);
            setError("An error occurred during registration. Please try again.");
        }
    };
    
    return { handleRegister };
}

export default useRegister ;
