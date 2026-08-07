import { register, logout, type RegisterPayload } from "../services/auth.ts";

function useRegister<T extends RegisterPayload>(path: string, form: T, setError: React.Dispatch<React.SetStateAction<string>>) {
    const handleRegister = async () => {
        try {
            const response = await register(form);
            const data = await response.json();
            if (response.ok) {
                alert("Registration successful!");
            }
            if (response.status === 400) {
                setError(data?.message ?? "Invalid registration data.");
            }
            if (response.status === 401) {
                await logout(path);
                setError(data?.message ?? "Unauthorized. Please log in.");
            }
            if (response.status === 409) {
                setError(data?.message ?? "User already exists.");
            }
        }
        catch (e) {
            console.error("Error during registration:", e);
            setError("An error occurred during registration. Please try again.");
        }
    };
    
    return { handleRegister };
}

export default useRegister ;
