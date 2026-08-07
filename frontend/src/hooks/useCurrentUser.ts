import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {logout } from "../services/auth";
import {getUserById, type UserData} from "../services/users";

export function useCurrentUser( path: string, setUserData: React.Dispatch<React.SetStateAction<UserData>>) {
    const navigate = useNavigate();
    
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await getUserById();
                
                if (!response.ok) {
                    throw new Error("Failed to fetch current user");
                }
                
                const data = await response.json();
                setUserData(data.user);
            }
            
            catch (error) {
                alert("Error fetching current user. Please log in again.");
                console.error("Error fetching current user:", error);
                logout(path);
            }
        };
        
        getCurrentUser();
    }, [navigate, setUserData]);
}

export default useCurrentUser;