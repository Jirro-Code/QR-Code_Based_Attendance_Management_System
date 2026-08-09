import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {logout } from "../services/auth";
import {getUserById, type UserData} from "../services/users";

export const useCurrentUser = (path: string, setUserData: React.Dispatch<React.SetStateAction<UserData>>) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const useGetCurrentUser = async () => {
            try {
                const response = await getUserById();
                const data = await response.json();
                
                if (response.status === 401) {
                    await logout(path);
                    throw new Error(data?.message ?? "Unauthorized. Please log in.");
                }
                if (!response.ok) {
                    throw new Error(data?.message ?? "Failed to fetch current user");
                }
                setUserData(data.user);
            }
            catch (error) {
                alert("Something went wrong. Please log in again.");
                console.error("Error fetching current user:", error);
                logout(path);
            }
        };
        
        useGetCurrentUser();
    }, [navigate, setUserData]);
}