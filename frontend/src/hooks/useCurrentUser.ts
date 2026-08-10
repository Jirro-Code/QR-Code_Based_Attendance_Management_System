import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {logout } from "../services/auth";
import {getSelf, type User } from "../services/users";

export const useCurrentUser = (path: string, setUserData: React.Dispatch<React.SetStateAction<Partial<User>>>) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const useGetCurrentUser = async () => {
            try {
                const response = await getSelf();
                const data = await response.json();
                
                if (response.status === 401) {
                    alert("Unauthorized. Please log in.");
                    await logout(path);
                    throw new Error(data?.message ?? "Unauthorized. Please log in.");
                }
                if (!response.ok) {
                    alert("Something went wrong. Please try again later.");
                    throw new Error(data?.message ?? "Failed to fetch current user");
                }
                setUserData(data.user);
            }
            catch (error) {
                alert("Something went wrong. Please try again later.");
                console.error("Error fetching current user:", error);
            }
        };
        
        useGetCurrentUser();
    }, [navigate, setUserData]);
}