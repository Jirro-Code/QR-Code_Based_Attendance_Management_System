import { logout } from "../services/auth";
import { UpdateUser } from "../services/users";
import { type User } from "../services/users";

function useUpdate() {
    async function updateData(data: User, setError: React.Dispatch<React.SetStateAction<string>>) {
        try {
            const response = await UpdateUser(data.id, data);
            const responseData = await response.json();
            if (response.status === 401) {
                await logout("/admin-login");
                throw new Error("Unauthorized. Redirecting to login.");
            }
            if (response.status === 403) {
                setError("Access denied. You do not have permission to perform this action.");
                throw new Error("Access denied. You do not have permission to perform this action.");
            }
            if (response.status === 404) {
                setError("User not found.");
                throw new Error("User not found.");
            }
            if (!response.ok) {
                setError(responseData.message || "Failed to update data.");
                throw new Error(responseData.message || "Failed to update data.");
            }
            return responseData;
        } catch (error) {
            console.error("Error updating data:", error);
            throw error;
        }
    }
    return { updateData };
}
export default useUpdate;   