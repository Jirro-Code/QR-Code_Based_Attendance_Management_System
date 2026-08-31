import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {logout } from "../services/auth";
import {getSelf, type User } from "../services/users";
import { ApiError } from "../services/error";

export const useCurrentUser = (path: string, setUserData: React.Dispatch<React.SetStateAction<Partial<User>>>) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const useGetCurrentUser = async () => {
            try {
                const data = await getSelf();
                setUserData(data.user);
            }
            catch (e) {
                if (e instanceof ApiError) {
                    if (e.status === 400) {
                        alert("Bad request. Please contact the administrator.");
                    }
                    if (e.status === 401) {
                        alert("Unauthorized. Please log in.");
                        await logout(path);
                    }
                    if (e.status === 403) {
                        alert("This account is archived. Please contact the administrator.");
                    }
                    if (e.status === 404) {
                        alert("User not found. Please log in again.");
                        await logout(path);
                    }
                    if (e.status >= 500) {
                        alert("Server error. Please try again later.");
                    }
                    throw e;
                }
                alert("Something went wrong. Please try again later.");
                console.error("Error fetching current user:", e);
                throw e;
            }
        };
        
        useGetCurrentUser();
    }, [navigate, setUserData]);
}