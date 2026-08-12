import { useNavigate } from "react-router-dom";
import { login, type LoginPayload } from "../services/auth.ts";
import { ApiError } from "../services/error.ts";

export const useLogin = (path: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const navigate = useNavigate();
    
    const useLoginUser = async (form: LoginPayload) => {
        try {
            await login(form);
            navigate(path);
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.status === 400) {
                    setError(e?.message ?? "Bad request. Please check your input and try again.");
                }
                if (e.status === 401) {
                    setError(e?.message ?? "Invalid credentials.");
                }
                if (e.status === 404) {
                    setError(e?.message ?? "User not found.");
                }
                if (e.status >= 500) {
                    alert("Server error. Please try again later.");
                    setError("Server error. Please try again later.");
                }
                throw e;
            }
            alert("Something went wrong. Please try again later.");
            console.error("Error during login:", e);
            throw e;
        }
    };
    return { useLoginUser };
}