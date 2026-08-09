import { useNavigate } from "react-router-dom";
import { login, type LoginPayload } from "../services/auth.ts";


export const useLogin = (path: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const navigate = useNavigate();
    
    const useLoginUser = async (form: LoginPayload) => {
        try {
            const response = await login(form);
            const data = await response.json().catch(() => null);
            
            if (response.status === 401) {
                setError(data?.message ?? "Invalid credentials.");
                return;
            }
            
            if (response.status === 404) {
                setError(data?.message ?? "User not found.");
                return;
            }
            
            if (!response.ok) {
                setError(data?.message ?? "An error occurred during login.");
                return;
            }
            navigate(path);
        }
        catch (e) {
            console.error("Error during login:", e);
            setError("An error occurred during login. Please try again.");
        }
    };
    
    return { useLoginUser };
}