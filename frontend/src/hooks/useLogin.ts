import { useNavigate } from "react-router-dom";
import { login, type LoginPayload } from "../services/auth.ts";

function useLogin(path: string, setError: React.Dispatch<React.SetStateAction<string>>) {
    const navigate = useNavigate();
    
    const handleLogin = async (form: LoginPayload) => {
        try {
            const response = await login(form);
            const data = await response.json().catch(() => null);
            
            if (response.ok) {
                navigate(path, { replace: true });
                return;
            }
            
            if (response.status === 401) {
                setError(data?.message ?? "Invalid credentials.");
                return;
            }
            
            if (response.status === 404) {
                setError(data?.message ?? "User not found.");
                return;
            }
            
            setError(data?.message ?? "Unable to log in.");
        }
        catch (e) {
            console.error("Error during login:", e);
            setError("An error occurred during login. Please try again.");
        }
    };
    
    return { handleLogin };
}

export default useLogin;
