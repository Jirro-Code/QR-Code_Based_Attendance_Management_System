import { useNavigate } from "react-router-dom";
import { login, type LoginPayload } from "../services/auth.ts";
import { ApiError } from "../services/error.ts";

const getRestrictionMessage = (message: string, details: Record<string, unknown>) => {
    const restrictedUntil = details.restrictedUntil ?? details.lockedUntil;
    if (typeof restrictedUntil !== "string") return message;
    
    const expiry = new Date(restrictedUntil);
    if (Number.isNaN(expiry.getTime())) return message;
    
    const remainingSeconds = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / 1000));
    const remainingMinutes = Math.ceil(remainingSeconds / 60);
    if (remainingMinutes < 60) {
        return `${message} Please try again in ${remainingMinutes} ${remainingMinutes === 1 ? "minute" : "minutes"}.`;
    }
    
    const remainingHours = Math.ceil(remainingMinutes / 60);
    return `${message} Please try again in ${remainingHours} ${remainingHours === 1 ? "hour" : "hours"}.`;
};

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
                if (e.status === 403) {
                    setError(e?.message ?? "This account is archived. Please contact the administrator.");
                }
                if (e.status === 404) {
                    setError(e?.message ?? "User not found.");
                }
                if (e.status === 423) {
                    const restrictionMessage = getRestrictionMessage(e.message || "Login is temporarily locked.", e.details);
                    setError(restrictionMessage);
                    throw new ApiError(restrictionMessage, e.status, e.details);
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