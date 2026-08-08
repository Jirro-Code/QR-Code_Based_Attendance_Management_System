import { DeleteUser } from "../services/users";

function useDelete() {
    async function deleteStudent(id: string, setError: React.Dispatch<React.SetStateAction<string>>) {
        try {
            const response = await DeleteUser(id);
            const data = await response.json();
            if (response.status === 401) {
                setError("Unauthorized. Please log in.");
                throw new Error("Unauthorized. Please log in.");
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
                setError(data?.message || "Failed to delete data.");
                throw new Error(data?.message || "Failed to delete data.");
            }
            return data;
        } catch (error) {
            console.error("Error deleting data:", error);
            throw error;
        }
    }
    return { deleteStudent };
}

export default useDelete;